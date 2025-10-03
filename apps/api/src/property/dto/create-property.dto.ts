import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDecimal,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/uploads/properties/image-123.jpg' })
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Sala de estar da propriedade', required: false })
  alt?: string;

  @IsOptional()
  @ApiProperty({ example: true, default: false, required: false })
  isCover?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, default: 0, required: false })
  order?: number;
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Rua das Flores, 123' })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Centro' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'São Paulo' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SP' })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '01234-567' })
  zipCode: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Brasil', required: false })
  country?: string;
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty({ example: 'PROP001' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty({ example: 'Casa de 3 quartos no centro' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  @ApiProperty({ example: 'Lindo imóvel com...', required: false })
  description?: string;

  @IsEnum(PropertyType)
  @ApiProperty({ enum: PropertyType, example: PropertyType.HOUSE })
  type: PropertyType;

  @IsEnum(PropertyStatus)
  @IsOptional()
  @ApiProperty({
    enum: PropertyStatus,
    example: PropertyStatus.ACTIVE,
    required: false,
    default: PropertyStatus.ACTIVE,
  })
  status?: PropertyStatus;

  @IsDecimal()
  @IsOptional()
  @ApiProperty({ example: '450000.00', required: false })
  price?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 3, required: false })
  bedroom?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2, required: false })
  bathroom?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  parking?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 120.5, required: false })
  area?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @ApiProperty({ type: CreateAddressDto, required: false })
  address?: CreateAddressDto;

  @IsObject()
  @IsOptional()
  @ApiProperty({ example: { pool: true, garden: true }, required: false })
  features?: Record<string, any>;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'owner-uuid', required: false })
  ownerId?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  @ApiProperty({
    type: [CreateMediaDto],
    required: false,
    description: 'Lista de mídias da propriedade',
  })
  media?: CreateMediaDto[];
}
