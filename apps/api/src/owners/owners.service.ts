import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOwnerDto,
  UpdateOwnerDto,
  OwnerListQueryDto,
} from './dto/owners.dto';
import { Owner } from '@prisma/client';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    tenantId: string,
    query?: OwnerListQueryDto,
  ): Promise<{ data: Owner[]; meta: any }> {
    const { search, page = 1, limit = 20 } = query || {};

    // Construir filtros
    const where: any = { tenantId };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Buscar owners com filtros e paginação
    const [owners, total] = await Promise.all([
      this.prisma.owner.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
      }),
      this.prisma.owner.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: owners,
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

  async findOne(tenantId: string, id: string): Promise<Owner> {
    const owner = await this.prisma.owner.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        properties: {
          select: {
            id: true,
            code: true,
            title: true,
            type: true,
            status: true,
            price: true,
          },
        },
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    return owner;
  }

  async create(
    tenantId: string,
    createOwnerDto: CreateOwnerDto,
  ): Promise<Owner> {
    try {
      // Normalizar email se fornecido
      const normalizedEmail = createOwnerDto.email?.toLowerCase().trim();

      // Verificar se já existe owner com mesmo email no tenant
      if (normalizedEmail) {
        const existingOwner = await this.prisma.owner.findFirst({
          where: {
            tenantId,
            email: normalizedEmail,
          },
        });

        if (existingOwner) {
          throw new BadRequestException('Owner with this email already exists');
        }
      }

      const owner = await this.prisma.owner.create({
        data: {
          ...createOwnerDto,
          tenantId,
          email: normalizedEmail,
        },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });

      return owner;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create owner');
    }
  }

  async update(
    tenantId: string,
    id: string,
    updateOwnerDto: UpdateOwnerDto,
  ): Promise<Owner> {
    // Verificar se o owner existe
    const existingOwner = await this.findOne(tenantId, id);

    try {
      // Normalizar email se fornecido
      const normalizedEmail = updateOwnerDto.email?.toLowerCase().trim();

      // Verificar se já existe outro owner com mesmo email no tenant
      if (normalizedEmail && normalizedEmail !== existingOwner.email) {
        const duplicateOwner = await this.prisma.owner.findFirst({
          where: {
            tenantId,
            email: normalizedEmail,
            id: {
              not: id,
            },
          },
        });

        if (duplicateOwner) {
          throw new BadRequestException('Owner with this email already exists');
        }
      }

      const owner = await this.prisma.owner.update({
        where: { id },
        data: {
          ...updateOwnerDto,
          email: normalizedEmail,
        },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });

      return owner;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update owner');
    }
  }

  async remove(tenantId: string, id: string): Promise<void> {
    // Verificar se o owner existe
    await this.findOne(tenantId, id);

    // Verificar se o owner tem propriedades associadas
    const propertiesCount = await this.prisma.property.count({
      where: {
        ownerId: id,
        tenantId,
      },
    });

    if (propertiesCount > 0) {
      throw new BadRequestException(
        `Cannot delete owner with ${propertiesCount} associated properties`,
      );
    }

    await this.prisma.owner.delete({
      where: { id },
    });
  }
}
