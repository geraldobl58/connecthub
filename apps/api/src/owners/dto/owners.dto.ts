import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOwnerDto {
  @ApiProperty({
    description: 'Nome do proprietário',
    example: 'João Silva',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Telefone do proprietário',
    example: '(11) 99999-9999',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email do proprietário',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Observações sobre o proprietário',
    example: 'Proprietário preferencial para contato via WhatsApp',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOwnerDto {
  @ApiPropertyOptional({
    description: 'Nome do proprietário',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Telefone do proprietário',
    example: '(11) 99999-9999',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email do proprietário',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Observações sobre o proprietário',
    example: 'Proprietário preferencial para contato via WhatsApp',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class OwnerListQueryDto {
  @ApiPropertyOptional({
    description: 'Termo de busca por nome, email ou telefone',
    example: 'João',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
