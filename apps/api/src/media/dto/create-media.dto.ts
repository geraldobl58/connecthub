import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: 'ID da propriedade',
    example: 'clh1234567890',
  })
  @IsString()
  propertyId: string;

  @ApiProperty({
    description: 'URL da mídia',
    example: '/uploads/properties/image-123.jpg',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Texto alternativo da imagem',
    example: 'Sala de estar da propriedade',
    required: false,
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiProperty({
    description: 'Se é a imagem de capa',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCover?: boolean;

  @ApiProperty({
    description: 'Ordem da mídia',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
