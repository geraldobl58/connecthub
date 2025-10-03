import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty({
    description: 'Nome do proprietário',
    example: 'João Silva',
  })
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Email do proprietário',
    example: 'joao.silva@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Telefone do proprietário',
    example: '(11) 99999-9999',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Notas sobre o proprietário',
    example: 'Proprietário de longa data, sempre pontual nos pagamentos',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
