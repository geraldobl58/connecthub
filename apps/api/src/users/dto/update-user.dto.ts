import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@empresa.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: Role,
    example: Role.AGENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
