import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyListQueryDto,
} from './dto/properties.dto';
import { Property } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    tenantId: string,
    query?: PropertyListQueryDto,
  ): Promise<{ data: Property[]; meta: any }> {
    const {
      search,
      type,
      status,
      ownerId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = query || {};

    // Construir filtros
    const where: any = { tenantId };

    if (search) {
      where.OR = [
        {
          code: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Buscar properties com filtros e paginação
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(tenantId: string, id: string): Promise<Property> {
    const property = await this.prisma.property.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async create(
    tenantId: string,
    createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    try {
      // Verificar se já existe property com mesmo código no tenant
      const existingProperty = await this.prisma.property.findFirst({
        where: {
          tenantId,
          code: createPropertyDto.code,
        },
      });

      if (existingProperty) {
        throw new BadRequestException('Property with this code already exists');
      }

      // Verificar se o owner existe (se fornecido)
      if (createPropertyDto.ownerId) {
        const owner = await this.prisma.owner.findFirst({
          where: {
            id: createPropertyDto.ownerId,
            tenantId,
          },
        });

        if (!owner) {
          throw new BadRequestException('Owner not found');
        }
      }

      // Criar property
      const property = await this.prisma.property.create({
        data: {
          code: createPropertyDto.code,
          title: createPropertyDto.title,
          description: createPropertyDto.description,
          type: createPropertyDto.type,
          status: createPropertyDto.status,
          price: createPropertyDto.price,
          minPrice: createPropertyDto.minPrice,
          maxPrice: createPropertyDto.maxPrice,
          bedroom: createPropertyDto.bedroom,
          bathroom: createPropertyDto.bathroom,
          parking: createPropertyDto.parking,
          area: createPropertyDto.area,
          ownerId: createPropertyDto.ownerId,
          address: createPropertyDto.address,
          features: createPropertyDto.features,
          coverImage: createPropertyDto.coverImage,
          galleryImages: createPropertyDto.galleryImages || [],
          tenantId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return property;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create property');
    }
  }

  async update(
    tenantId: string,
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    // Verificar se o property existe
    const existingProperty = await this.findOne(tenantId, id);

    try {
      // Verificar se já existe outro property com mesmo código no tenant
      if (
        updatePropertyDto.code &&
        updatePropertyDto.code !== existingProperty.code
      ) {
        const duplicateProperty = await this.prisma.property.findFirst({
          where: {
            tenantId,
            code: updatePropertyDto.code,
            id: {
              not: id,
            },
          },
        });

        if (duplicateProperty) {
          throw new BadRequestException(
            'Property with this code already exists',
          );
        }
      }

      // Verificar se o owner existe (se fornecido)
      if (updatePropertyDto.ownerId) {
        const owner = await this.prisma.owner.findFirst({
          where: {
            id: updatePropertyDto.ownerId,
            tenantId,
          },
        });

        if (!owner) {
          throw new BadRequestException('Owner not found');
        }
      }

      // Atualizar property
      const property = await this.prisma.property.update({
        where: { id },
        data: {
          code: updatePropertyDto.code,
          title: updatePropertyDto.title,
          description: updatePropertyDto.description,
          type: updatePropertyDto.type,
          status: updatePropertyDto.status,
          price: updatePropertyDto.price,
          minPrice: updatePropertyDto.minPrice,
          maxPrice: updatePropertyDto.maxPrice,
          bedroom: updatePropertyDto.bedroom,
          bathroom: updatePropertyDto.bathroom,
          parking: updatePropertyDto.parking,
          area: updatePropertyDto.area,
          ownerId: updatePropertyDto.ownerId,
          address: updatePropertyDto.address,
          features: updatePropertyDto.features,
          coverImage: updatePropertyDto.coverImage,
          galleryImages: updatePropertyDto.galleryImages,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return property;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update property');
    }
  }

  async remove(tenantId: string, id: string): Promise<void> {
    // Verificar se o property existe
    await this.findOne(tenantId, id);

    // Deletar property
    await this.prisma.property.delete({
      where: { id },
    });
  }
}
