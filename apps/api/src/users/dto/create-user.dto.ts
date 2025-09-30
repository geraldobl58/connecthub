import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@empresa.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: Role,
    example: Role.AGENT,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
