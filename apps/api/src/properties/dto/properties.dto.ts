import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsObject,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Código único da propriedade',
    example: 'PROP001',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Título da propriedade',
    example: 'Casa com 3 quartos em São Paulo',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da propriedade',
    example: 'Casa espaçosa com jardim e garagem para 2 carros',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tipo da propriedade',
    enum: PropertyType,
    example: PropertyType.HOUSE,
  })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiPropertyOptional({
    description: 'Status da propriedade',
    enum: PropertyStatus,
    example: PropertyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({
    description: 'Preço da propriedade',
    example: 500000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Preço mínimo da propriedade',
    example: 400000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo da propriedade',
    example: 600000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Número de quartos',
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  bedroom?: number;

  @ApiPropertyOptional({
    description: 'Número de banheiros',
    example: 2,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  bathroom?: number;

  @ApiPropertyOptional({
    description: 'Número de vagas de garagem',
    example: 2,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  parking?: number;

  @ApiPropertyOptional({
    description: 'Área da propriedade em m²',
    example: 120.5,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({
    description: 'ID do proprietário',
    example: 'uuid-do-proprietario',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Endereço da propriedade',
    example: {
      street: 'Rua das Flores',
      number: '123',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567',
    },
  })
  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };

  @ApiPropertyOptional({
    description: 'Características especiais da propriedade',
    example: {
      pool: true,
      garden: true,
      security: true,
    },
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'URL da imagem de capa da propriedade',
    example: 'https://example.com/images/property-cover.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Array de URLs das imagens da galeria',
    example: [
      'https://example.com/images/property-1.jpg',
      'https://example.com/images/property-2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];
}

export class UpdatePropertyDto {
  @ApiPropertyOptional({
    description: 'Código único da propriedade',
    example: 'PROP001',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Título da propriedade',
    example: 'Casa com 3 quartos em São Paulo',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da propriedade',
    example: 'Casa espaçosa com jardim e garagem para 2 carros',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tipo da propriedade',
    enum: PropertyType,
    example: PropertyType.HOUSE,
  })
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @ApiPropertyOptional({
    description: 'Status da propriedade',
    enum: PropertyStatus,
    example: PropertyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({
    description: 'Preço da propriedade',
    example: 500000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Preço mínimo da propriedade',
    example: 400000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo da propriedade',
    example: 600000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Número de quartos',
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  bedroom?: number;

  @ApiPropertyOptional({
    description: 'Número de banheiros',
    example: 2,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  bathroom?: number;

  @ApiPropertyOptional({
    description: 'Número de vagas de garagem',
    example: 2,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  parking?: number;

  @ApiPropertyOptional({
    description: 'Área da propriedade em m²',
    example: 120.5,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({
    description: 'ID do proprietário',
    example: 'uuid-do-proprietario',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Endereço da propriedade',
    example: {
      street: 'Rua das Flores',
      number: '123',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567',
    },
  })
  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };

  @ApiPropertyOptional({
    description: 'Características especiais da propriedade',
    example: {
      pool: true,
      garden: true,
      security: true,
    },
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'URL da imagem de capa da propriedade',
    example: 'https://example.com/images/property-cover.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Array de URLs das imagens da galeria',
    example: [
      'https://example.com/images/property-1.jpg',
      'https://example.com/images/property-2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];
}

export class PropertyListQueryDto {
  @ApiPropertyOptional({
    description: 'Termo de busca por código, título ou descrição',
    example: 'Casa',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de propriedade',
    enum: PropertyType,
  })
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @ApiPropertyOptional({
    description: 'Filtrar por status da propriedade',
    enum: PropertyStatus,
  })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por proprietário',
    example: 'uuid-do-proprietario',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Preço mínimo',
    example: 100000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo',
    example: 1000000,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Número da página',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Limite de itens por página',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  limit?: number;
}
