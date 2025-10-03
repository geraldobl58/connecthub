import { ApiProperty } from '@nestjs/swagger';
import { Owner } from '@prisma/client';

export class OwnerResponseDto {
  @ApiProperty({
    description: 'ID do proprietário',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'ID do tenant',
    example: 'clh1234567890',
  })
  tenantId: string;

  @ApiProperty({
    description: 'Nome do proprietário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do proprietário',
    example: 'joao.silva@email.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Telefone do proprietário',
    example: '(11) 99999-9999',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Notas sobre o proprietário',
    example: 'Proprietário de longa data',
    required: false,
  })
  notes?: string;

  constructor(owner: Owner) {
    this.id = owner.id;
    this.tenantId = owner.tenantId;
    this.name = owner.name;
    this.email = owner.email || undefined;
    this.phone = owner.phone || undefined;
    this.notes = owner.notes || undefined;
  }
}

export class PaginatedOwnersResponseDto {
  @ApiProperty({
    description: 'Lista de proprietários',
    type: [OwnerResponseDto],
  })
  data: OwnerResponseDto[];

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
