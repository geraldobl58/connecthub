import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsNumber,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { LeadSource } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  @MinLength(1, { message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.replace(/\D/g, '')) // Remove caracteres não numéricos
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => (value as string)?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsUUID()
  stageId?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'Observações devem ter no máximo 1000 caracteres',
  })
  notesText?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.replace(/\D/g, '')) // Remove caracteres não numéricos
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => (value as string)?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsUUID()
  stageId?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'Observações devem ter no máximo 1000 caracteres',
  })
  notesText?: string;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class MoveLeadDto {
  @IsString()
  @IsUUID()
  stageId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Observações devem ter no máximo 500 caracteres' })
  notes?: string;
}

export class LeadListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  stageId?: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string)?.replace(/\D/g, '')) // Remove caracteres não numéricos
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => (value as string)?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : (value as string[]),
  )
  tags?: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit?: number;
}
