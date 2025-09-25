import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class LoginDto {
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
  @IsString()
  @ApiProperty({
    example: 'tenant-id-or-slug',
    description: 'Optional tenant ID or slug for multi-tenant login',
    required: false,
  })
  tenantId?: string;
}
