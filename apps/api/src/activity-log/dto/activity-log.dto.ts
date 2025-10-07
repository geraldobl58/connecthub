import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActivityLogQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por entidade (ex: Lead, User, Property)',
    example: 'Lead',
  })
  @IsOptional()
  @IsString()
  entity?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID específico da entidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

export class ActivityLogResponseDto {
  @ApiPropertyOptional({
    description: 'ID do log de atividade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'ID do tenant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tenantId: string;

  @ApiPropertyOptional({
    description: 'ID do usuário que executou a ação',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  actorId: string | null;

  @ApiPropertyOptional({
    description: 'Entidade afetada',
    example: 'Lead',
  })
  entity: string;

  @ApiPropertyOptional({
    description: 'ID da entidade afetada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  entityId: string;

  @ApiPropertyOptional({
    description: 'Ação executada',
    example: 'LEAD_CREATED',
  })
  action: string;

  @ApiPropertyOptional({
    description: 'Metadados da ação',
    example: { leadName: 'João Silva', source: 'WEB' },
    nullable: true,
  })
  metadata: any;

  @ApiPropertyOptional({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Informações do usuário que executou a ação',
    nullable: true,
  })
  actor?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export class ActivityLogListResponseDto {
  @ApiPropertyOptional({
    description: 'Lista de logs de atividade',
    type: [ActivityLogResponseDto],
  })
  data: ActivityLogResponseDto[];

  @ApiPropertyOptional({
    description: 'Metadados da paginação',
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
