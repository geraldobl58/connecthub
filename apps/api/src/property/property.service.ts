import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    tenantId: string,
  ): Promise<PropertyResponseDto> {
    // Verificar se o código já existe no tenant
    const existingProperty = await this.prisma.property.findUnique({
      where: {
        tenantId_code: {
          tenantId,
          code: createPropertyDto.code,
        },
      },
    });

    if (existingProperty) {
      throw new ConflictException(
        'Property code already exists in this tenant',
      );
    }

    // Verificar se o owner existe e pertence ao tenant (se fornecido)
    if (createPropertyDto.ownerId) {
      const owner = await this.prisma.owner.findFirst({
        where: {
          id: createPropertyDto.ownerId,
          tenantId,
        },
      });

      if (!owner) {
        throw new NotFoundException('Owner not found in this tenant');
      }
    }

    const property = await this.prisma.property.create({
      data: {
        ...createPropertyDto,
        // Converter price de string para Decimal se necessário
        price: createPropertyDto.price
          ? parseFloat(createPropertyDto.price.toString())
          : null,
        tenantId,
        address: createPropertyDto.address
          ? {
              create: {
                street: createPropertyDto.address.street,
                number: null, // campo não está no DTO, deixar null
                district: createPropertyDto.address.neighborhood, // mapear neighborhood para district
                city: createPropertyDto.address.city,
                state: createPropertyDto.address.state,
                zip: createPropertyDto.address.zipCode, // mapear zipCode para zip
                lat: null, // campo não está no DTO, deixar null
                lng: null, // campo não está no DTO, deixar null
              },
            }
          : undefined,
        media: createPropertyDto.media
          ? {
              create: createPropertyDto.media.map((media, index) => ({
                url: media.url,
                alt: media.alt,
                isCover: media.isCover || false,
                order: media.order || index,
              })),
            }
          : undefined,
      },
      include: {
        address: true,
        media: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return this.mapToResponseDto(property);
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: PropertyResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: {
          tenantId,
          deletedAt: null,
        },
        include: {
          address: true,
          media: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.property.count({
        where: {
          tenantId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: properties.map((property) => this.mapToResponseDto(property)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, tenantId: string): Promise<PropertyResponseDto> {
    const property = await this.prisma.property.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        address: true,
        media: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.mapToResponseDto(property);
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    tenantId: string,
  ): Promise<PropertyResponseDto> {
    // Verificar se a propriedade existe e pertence ao tenant
    const existingProperty = await this.prisma.property.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!existingProperty) {
      throw new NotFoundException('Property not found');
    }

    // Verificar se o código já existe em outra propriedade do mesmo tenant
    if (
      updatePropertyDto.code &&
      updatePropertyDto.code !== existingProperty.code
    ) {
      const codeExists = await this.prisma.property.findUnique({
        where: {
          tenantId_code: {
            tenantId,
            code: updatePropertyDto.code,
          },
        },
      });

      if (codeExists) {
        throw new ConflictException(
          'Property code already exists in this tenant',
        );
      }
    }

    // Verificar se o owner existe e pertence ao tenant (se fornecido)
    if (updatePropertyDto.ownerId) {
      const owner = await this.prisma.owner.findFirst({
        where: {
          id: updatePropertyDto.ownerId,
          tenantId,
        },
      });

      if (!owner) {
        throw new NotFoundException('Owner not found in this tenant');
      }
    }

    // Separar campos que não podem ser atualizados diretamente
    const { media, ...updateData } = updatePropertyDto;

    const property = await this.prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        address: updateData.address
          ? {
              upsert: {
                create: updateData.address,
                update: updateData.address,
              },
            }
          : undefined,
      },
      include: {
        address: true,
        media: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return this.mapToResponseDto(property);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    // Verificar se a propriedade existe e pertence ao tenant
    const property = await this.prisma.property.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Soft delete
    await this.prisma.property.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async search(
    tenantId: string,
    query: string,
    type?: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: PropertyResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const whereClause: any = {
      tenantId,
      deletedAt: null,
    };

    // Adicionar filtros de busca
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (type) {
      whereClause.type = type;
    }

    if (status) {
      whereClause.status = status;
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: whereClause,
        include: {
          address: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.property.count({
        where: whereClause,
      }),
    ]);

    return {
      data: properties.map((property) => this.mapToResponseDto(property)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapToResponseDto(property: any): PropertyResponseDto {
    return {
      id: property.id,
      tenantId: property.tenantId,
      code: property.code,
      title: property.title,
      description: property.description,
      type: property.type,
      status: property.status,
      price: property.price ? Number(property.price) : undefined,
      bedroom: property.bedroom,
      bathroom: property.bathroom,
      parking: property.parking,
      area: property.area,
      address: property.address,
      features: property.features,
      media: property.media || [],
      ownerId: property.ownerId,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      deletedAt: property.deletedAt,
    };
  }
}
