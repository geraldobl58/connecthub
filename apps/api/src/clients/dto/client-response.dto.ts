import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({
    description: 'ID único do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da empresa/cliente',
    example: 'Empresa XYZ',
  })
  name: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'contato@empresa.com',
  })
  email: string;

  @ApiProperty({
    description: 'Endereço',
    example: 'Rua das Flores',
  })
  address: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  number: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apartamento 42',
    nullable: true,
  })
  complement: string | null;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  neighborhood: string;

  @ApiProperty({
    description: 'CEP',
    example: '12345-678',
  })
  zipCode: string;

  @ApiProperty({
    description: 'Telefone',
    example: '(11) 98765-4321',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-11-12T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-11-12T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedClientResponseDto {
  @ApiProperty({
    description: 'Lista de clientes',
    type: [ClientResponseDto],
  })
  data: ClientResponseDto[];

  @ApiProperty({
    description: 'Total de registros',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limite de registros por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Registros retornados nesta página',
    example: 20,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Se há próxima página',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Se há página anterior',
    example: false,
  })
  hasPrevPage: boolean;
}
