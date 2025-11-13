import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
  PaginatedClientResponseDto,
} from './dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    createClientDto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    // Verificar se email já existe para este tenant
    const existingClient = await this.prisma.client.findFirst({
      where: {
        tenantId,
        email: createClientDto.email,
      },
    });

    if (existingClient) {
      throw new ConflictException(
        'Cliente com este email já existe neste tenant',
      );
    }

    const client = await this.prisma.client.create({
      data: {
        ...createClientDto,
        tenantId,
      },
    });

    return this.mapToResponseDto(client);
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<PaginatedClientResponseDto> {
    // Validação de paginação
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 10000) limit = 10000; // Máximo de 10.000 registros

    const skip = (page - 1) * limit;

    // Construir filtro de busca com isolamento de tenant
    const where = {
      tenantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { address: { contains: search, mode: 'insensitive' as const } },
          {
            neighborhood: { contains: search, mode: 'insensitive' as const },
          },
          { zipCode: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    // Buscar dados com paginação
    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    const pageSize = clients.length;
    const hasNextPage = total > page * limit;
    const hasPrevPage = page > 1;

    return {
      data: clients.map((client) => this.mapToResponseDto(client)),
      total,
      page,
      limit,
      pageSize,
      hasNextPage,
      hasPrevPage,
    };
  }

  async findAllWithoutPagination(
    tenantId: string,
  ): Promise<ClientResponseDto[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        tenantId,
      },
      orderBy: { name: 'asc' },
      distinct: ['id'], // Garante que cada ID apareça apenas uma vez
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        number: true,
        complement: true,
        neighborhood: true,
        zipCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return clients.map((client) => this.mapToResponseDto(client));
  }

  async findOne(tenantId: string, id: string): Promise<ClientResponseDto> {
    const client = await this.prisma.client.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(client);
  }

  async update(
    tenantId: string,
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    // Verificar se cliente existe e pertence ao tenant
    await this.findOne(tenantId, id);

    // Se está atualizando email, verificar se novo email já existe para este tenant
    if (updateClientDto.email && updateClientDto.email.length > 0) {
      const existingClient = await this.prisma.client.findFirst({
        where: {
          tenantId,
          email: updateClientDto.email,
          id: { not: id },
        },
      });

      if (existingClient) {
        throw new ConflictException(
          'Este email já está registrado para outro cliente neste tenant',
        );
      }
    }

    const client = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });

    return this.mapToResponseDto(client);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    // Verificar se cliente existe e pertence ao tenant
    await this.findOne(tenantId, id);

    // Verificar se cliente tem contratos associados
    const contractCount = await this.prisma.contract.count({
      where: {
        clientId: id,
        tenantId,
      },
    });

    if (contractCount > 0) {
      throw new BadRequestException(
        `Cliente possui ${contractCount} contrato(s) associado(s) e não pode ser removido`,
      );
    }

    await this.prisma.client.delete({
      where: { id },
    });
  }

  private mapToResponseDto(client: any): ClientResponseDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      address: client.address,
      number: client.number,
      complement: client.complement,
      neighborhood: client.neighborhood,
      zipCode: client.zipCode,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
