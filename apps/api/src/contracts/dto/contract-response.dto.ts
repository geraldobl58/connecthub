import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from '../../clients/dto';

export class ContractResponseDto {
  @ApiProperty({
    description: 'ID único do contrato',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título do contrato',
    example: 'Contrato de Prestação de Serviços',
  })
  title: string;

  @ApiProperty({
    description: 'Identificador único do contrato',
    example: 'CTR-2025-001',
  })
  identifier: string;

  @ApiProperty({
    description: 'Conteúdo do contrato',
    example: 'Texto completo do contrato...',
    nullable: true,
  })
  content: string | null;

  @ApiProperty({
    description: 'Data de início da vigência',
    example: '2025-11-12T00:00:00Z',
  })
  initialEffectiveDate: Date;

  @ApiProperty({
    description: 'Data de término da vigência',
    example: '2026-11-12T00:00:00Z',
  })
  finalEffectiveDate: Date;

  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  clientId: string | null;

  @ApiProperty({
    description: 'Dados do cliente associado',
    type: ClientResponseDto,
    nullable: true,
  })
  clients?: ClientResponseDto | null;

  @ApiProperty({
    description: 'Data em que o contrato foi assinado',
    example: '2025-11-12T10:00:00Z',
    nullable: true,
  })
  signedAt: Date | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-11-12T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-11-12T10:00:00Z',
  })
  updatedAt: Date;
}

export class PaginatedContractResponseDto {
  @ApiProperty({
    description: 'Lista de contratos',
    type: [ContractResponseDto],
  })
  data: ContractResponseDto[];

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
