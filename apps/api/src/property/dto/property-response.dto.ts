import { ApiProperty } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class MediaResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'property-uuid' })
  propertyId: string;

  @ApiProperty({ example: '/uploads/properties/image-123.jpg' })
  url: string;

  @ApiProperty({ example: 'Sala de estar da propriedade', required: false })
  alt?: string;

  @ApiProperty({ example: true })
  isCover: boolean;

  @ApiProperty({ example: 1 })
  order: number;
}

export class AddressResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Rua das Flores, 123' })
  street: string;

  @ApiProperty({ example: 'Centro' })
  district: string;

  @ApiProperty({ example: 'São Paulo' })
  city: string;

  @ApiProperty({ example: 'SP' })
  state: string;

  @ApiProperty({ example: '01234-567' })
  zip: string;

  @ApiProperty({ example: 'Brasil' })
  country: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PropertyResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'tenant-uuid' })
  tenantId: string;

  @ApiProperty({ example: 'PROP001' })
  code: string;

  @ApiProperty({ example: 'Casa de 3 quartos no centro' })
  title: string;

  @ApiProperty({ example: 'Lindo imóvel com...', required: false })
  description?: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.HOUSE })
  type: PropertyType;

  @ApiProperty({ enum: PropertyStatus, example: PropertyStatus.ACTIVE })
  status: PropertyStatus;

  @ApiProperty({ example: '450000.00', required: false })
  price?: number;

  @ApiProperty({ example: 3, required: false })
  bedroom?: number;

  @ApiProperty({ example: 2, required: false })
  bathroom?: number;

  @ApiProperty({ example: 1, required: false })
  parking?: number;

  @ApiProperty({ example: 120.5, required: false })
  area?: number;

  @ApiProperty({ type: AddressResponseDto, required: false })
  address?: AddressResponseDto;

  @ApiProperty({ example: { pool: true, garden: true }, required: false })
  features?: Record<string, any>;

  @ApiProperty({ type: [MediaResponseDto], required: false })
  media?: MediaResponseDto[];

  @ApiProperty({ example: 'owner-uuid', required: false })
  ownerId?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: null, required: false })
  deletedAt?: Date;
}
