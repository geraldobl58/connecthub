import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@empresa.com',
  })
  email: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: Role,
    example: Role.AGENT,
  })
  role: Role;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID do tenant',
    example: 'clx1234567890',
  })
  tenantId: string;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Informações de paginação',
    example: {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
