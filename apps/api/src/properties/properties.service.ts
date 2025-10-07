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
          _count: {
            select: {
              leads: true,
              deals: true,
              tasks: true,
              notes: true,
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
        media: {
          orderBy: {
            order: 'asc',
          },
        },
        leads: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            source: true,
            stage: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        deals: {
          select: {
            id: true,
            value: true,
            status: true,
            createdAt: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
        notes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            leads: true,
            deals: true,
            tasks: true,
            notes: true,
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
          _count: {
            select: {
              leads: true,
              deals: true,
              tasks: true,
              notes: true,
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
          _count: {
            select: {
              leads: true,
              deals: true,
              tasks: true,
              notes: true,
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

    // Verificar se o property tem leads, deals ou tasks associados
    const relatedCounts = await this.prisma.property.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            leads: true,
            deals: true,
            tasks: true,
          },
        },
      },
    });

    const totalRelated =
      (relatedCounts?._count.leads || 0) +
      (relatedCounts?._count.deals || 0) +
      (relatedCounts?._count.tasks || 0);

    if (totalRelated > 0) {
      throw new BadRequestException(
        `Cannot delete property with ${totalRelated} associated records (leads, deals, or tasks)`,
      );
    }

    // Deletar property (address será deletado automaticamente por cascade)
    await this.prisma.property.delete({
      where: { id },
    });
  }
}
