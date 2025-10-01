import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import {
  UserResponseDto,
  PaginatedUsersResponseDto,
} from './dto/user-response.dto';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    tenantId: string,
    currentUserRole: Role,
  ): Promise<UserResponseDto> {
    // Verificar se o usuário atual tem permissão para criar usuários
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Apenas administradores podem criar usuários',
      );
    }

    // Verificar se o email já existe no tenant
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
        tenantId,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso neste tenant');
    }

    // Hash da senha
    const hashedPassword = await hash(createUserDto.password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        tenantId,
        isActive: createUserDto.isActive ?? true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        tenantId: true,
      },
    });

    return user;
  }

  async findAll(
    query: UserQueryDto,
    tenantId: string,
  ): Promise<PaginatedUsersResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Construir filtros
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    // Calcular offset
    const skip = (page - 1) * limit;

    // Buscar usuários com paginação
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          tenantId: true,
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string, tenantId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        tenantId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tenantId: string,
    currentUserRole: Role,
  ): Promise<UserResponseDto> {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar permissões
    if (currentUserRole !== Role.ADMIN && currentUserRole !== Role.MANAGER) {
      throw new ForbiddenException('Sem permissão para editar usuários');
    }

    // Se não for ADMIN, não pode alterar role
    if (updateUserDto.role && currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Apenas administradores podem alterar roles',
      );
    }

    // Se estiver alterando email, verificar se já existe
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          tenantId,
          deletedAt: null,
          id: { not: id },
        },
      });

      if (emailExists) {
        throw new ConflictException('Email já está em uso neste tenant');
      }
    }

    // Preparar dados para atualização
    const updateData: any = { ...updateUserDto };

    // Hash da senha se fornecida
    if (updateUserDto.password) {
      updateData.password = await hash(updateUserDto.password, 10);
    }

    // Atualizar usuário
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        tenantId: true,
      },
    });

    return user;
  }

  async remove(
    id: string,
    tenantId: string,
    currentUserRole: Role,
  ): Promise<void> {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar permissões
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Apenas administradores podem excluir usuários',
      );
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
