import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { OwnerQueryDto } from './dto/owner-query.dto';
import {
  OwnerResponseDto,
  PaginatedOwnersResponseDto,
} from './dto/owner-response.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async create(
    createOwnerDto: CreateOwnerDto,
    tenantId: string,
  ): Promise<OwnerResponseDto> {
    // Verificar se já existe um owner com o mesmo email no tenant
    if (createOwnerDto.email) {
      const existingOwner = await this.prisma.owner.findFirst({
        where: {
          tenantId,
          email: createOwnerDto.email,
        },
      });

      if (existingOwner) {
        throw new ConflictException(
          'Já existe um proprietário com este email neste tenant',
        );
      }
    }

    const owner = await this.prisma.owner.create({
      data: {
        ...createOwnerDto,
        tenantId,
      },
    });

    return new OwnerResponseDto(owner);
  }

  async findAll(
    query: OwnerQueryDto,
    tenantId: string,
  ): Promise<PaginatedOwnersResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {
      tenantId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Executar consultas em paralelo
    const [owners, total] = await Promise.all([
      this.prisma.owner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.owner.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: owners.map((owner) => new OwnerResponseDto(owner)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string, tenantId: string): Promise<OwnerResponseDto> {
    const owner = await this.prisma.owner.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!owner) {
      throw new NotFoundException('Proprietário não encontrado neste tenant');
    }

    return new OwnerResponseDto(owner);
  }

  async update(
    id: string,
    updateOwnerDto: UpdateOwnerDto,
    tenantId: string,
  ): Promise<OwnerResponseDto> {
    // Verificar se o owner existe
    const existingOwner = await this.prisma.owner.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existingOwner) {
      throw new NotFoundException('Proprietário não encontrado neste tenant');
    }

    // Verificar se o email já existe em outro owner
    if (updateOwnerDto.email && updateOwnerDto.email !== existingOwner.email) {
      const ownerWithEmail = await this.prisma.owner.findFirst({
        where: {
          tenantId,
          email: updateOwnerDto.email,
          id: { not: id },
        },
      });

      if (ownerWithEmail) {
        throw new ConflictException(
          'Já existe um proprietário com este email neste tenant',
        );
      }
    }

    const owner = await this.prisma.owner.update({
      where: { id },
      data: updateOwnerDto,
    });

    return new OwnerResponseDto(owner);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const owner = await this.prisma.owner.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!owner) {
      throw new NotFoundException('Proprietário não encontrado neste tenant');
    }

    // Verificar se o owner tem propriedades
    const propertyCount = await this.prisma.property.count({
      where: {
        ownerId: id,
        tenantId,
      },
    });

    if (propertyCount > 0) {
      throw new ConflictException(
        'Não é possível excluir proprietário que possui propriedades',
      );
    }

    await this.prisma.owner.delete({
      where: { id },
    });
  }

  async findByEmail(
    email: string,
    tenantId: string,
  ): Promise<OwnerResponseDto | null> {
    const owner = await this.prisma.owner.findFirst({
      where: {
        email,
        tenantId,
      },
    });

    return owner ? new OwnerResponseDto(owner) : null;
  }
}
