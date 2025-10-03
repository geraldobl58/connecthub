import { ApiProperty } from '@nestjs/swagger';
import { Media } from '@prisma/client';

export class MediaResponseDto {
  @ApiProperty({
    description: 'ID da mídia',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'ID da propriedade',
    example: 'clh1234567890',
  })
  propertyId: string;

  @ApiProperty({
    description: 'URL da mídia',
    example: '/uploads/properties/image-123.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Texto alternativo da imagem',
    example: 'Sala de estar da propriedade',
    required: false,
  })
  alt?: string;

  @ApiProperty({
    description: 'Se é a imagem de capa',
    example: true,
  })
  isCover: boolean;

  @ApiProperty({
    description: 'Ordem da mídia',
    example: 1,
  })
  order: number;

  constructor(media: Media) {
    this.id = media.id;
    this.propertyId = media.propertyId;
    this.url = media.url;
    this.alt = media.alt || undefined;
    this.isCover = media.isCover;
    this.order = media.order;
  }
}
