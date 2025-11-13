import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({
    description: 'Título do contrato',
    example: 'Contrato de Prestação de Serviços',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Identificador único do contrato',
    example: 'CTR-2025-001',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'Conteúdo do contrato',
    example: 'Texto completo do contrato...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Data de início da vigência',
    example: '2025-11-12T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  initialEffectiveDate: string;

  @ApiProperty({
    description: 'Data de término da vigência',
    example: '2026-11-12T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  finalEffectiveDate: string;

  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;
}
