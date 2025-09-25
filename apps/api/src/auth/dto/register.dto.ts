import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsStrongPassword,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'tenant-slug', description: 'Tenant identifier' })
  tenantId: string;

  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    example: 'MyPass123!',
    description:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol. Length: 6-20 chars.',
    minLength: 6,
    maxLength: 20,
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({ example: Role.AGENT, enum: Role, required: false })
  role?: Role;
}
