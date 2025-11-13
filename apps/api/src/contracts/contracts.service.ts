import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContractDto,
  UpdateContractDto,
  ContractResponseDto,
  PaginatedContractResponseDto,
} from './dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    createContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    // Verificar se identifier já existe para este tenant
    const existingContract = await this.prisma.contract.findFirst({
      where: {
        tenantId,
        identifier: createContractDto.identifier,
      },
    });

    if (existingContract) {
      throw new ConflictException(
        'Contrato com este identificador já existe neste tenant',
      );
    }

    // Verificar se cliente existe e pertence ao mesmo tenant
    const client = await this.prisma.client.findFirst({
      where: {
        id: createContractDto.clientId,
        tenantId,
      },
    });

    if (!client) {
      throw new NotFoundException(
        `Cliente com ID ${createContractDto.clientId} não encontrado neste tenant`,
      );
    }

    const contract = await this.prisma.contract.create({
      data: {
        ...createContractDto,
        tenantId,
      },
      include: {
        clients: true,
      },
    });

    return this.mapToResponseDto(contract);
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<PaginatedContractResponseDto> {
    // Validação de paginação
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;

    // Construir filtro de busca com isolamento de tenant
    const where = {
      tenantId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          {
            identifier: { contains: search, mode: 'insensitive' as const },
          },
          { content: { contains: search, mode: 'insensitive' as const } },
          {
            clients: {
              name: { contains: search, mode: 'insensitive' as const },
            },
          },
        ],
      }),
    };

    // Buscar dados com paginação
    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: limit,
        include: {
          clients: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contract.count({ where }),
    ]);

    const pageSize = contracts.length;
    const hasNextPage = total > page * limit;
    const hasPrevPage = page > 1;

    return {
      data: contracts.map((contract) => this.mapToResponseDto(contract)),
      total,
      page,
      limit,
      pageSize,
      hasNextPage,
      hasPrevPage,
    };
  }

  async findOne(tenantId: string, id: string): Promise<ContractResponseDto> {
    const contract = await this.prisma.contract.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        clients: true,
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(contract);
  }

  async update(
    tenantId: string,
    id: string,
    updateContractDto: UpdateContractDto,
  ): Promise<ContractResponseDto> {
    // Verificar se contrato existe e pertence ao tenant
    await this.findOne(tenantId, id);

    // Se está atualizando identifier, verificar se novo identifier já existe para este tenant
    if (updateContractDto.identifier) {
      const existingContract = await this.prisma.contract.findFirst({
        where: {
          tenantId,
          identifier: updateContractDto.identifier,
          id: { not: id },
        },
      });

      if (existingContract) {
        throw new ConflictException(
          'Este identificador já está registrado para outro contrato neste tenant',
        );
      }
    }

    // Verificar se cliente existe e pertence ao mesmo tenant
    if (updateContractDto.clientId) {
      const client = await this.prisma.client.findFirst({
        where: {
          id: updateContractDto.clientId,
          tenantId,
        },
      });

      if (!client) {
        throw new NotFoundException(
          `Cliente com ID ${updateContractDto.clientId} não encontrado neste tenant`,
        );
      }
    }

    const contract = await this.prisma.contract.update({
      where: { id },
      data: updateContractDto,
      include: {
        clients: true,
      },
    });

    return this.mapToResponseDto(contract);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    // Verificar se contrato existe e pertence ao tenant
    await this.findOne(tenantId, id);

    await this.prisma.contract.delete({
      where: { id },
    });
  }

  private mapToResponseDto(contract: any): ContractResponseDto {
    return {
      id: contract.id,
      title: contract.title,
      identifier: contract.identifier,
      content: contract.content,
      initialEffectiveDate: contract.initialEffectiveDate,
      finalEffectiveDate: contract.finalEffectiveDate,
      clientId: contract.clientId,
      clients: contract.clients,
      signedAt: contract.signedAt,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    };
  }
}
