import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export enum PlanType {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export class SignupDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Tech Solutions Corp',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  companyName: string;

  @ApiProperty({
    description: 'Nome do contato responsável',
    example: 'João Silva',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  contactName: string;

  @ApiProperty({
    description: 'Email do contato responsável',
    example: 'admin@tech-solutions.com',
  })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({
    description: 'Subdomínio personalizado (apenas letras minúsculas, números e hífens)',
    example: 'tech-solutions',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  domain: string;

  @ApiProperty({
    description: 'Plano escolhido',
    enum: PlanType,
    example: PlanType.PROFESSIONAL,
  })
  @IsEnum(PlanType)
  plan: PlanType;
}

