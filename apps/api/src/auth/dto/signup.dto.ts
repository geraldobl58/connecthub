import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsUrl } from 'class-validator';

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

  @ApiProperty({
    description: 'URL de sucesso para redirecionamento após pagamento',
    example: 'https://tech-solutions.connecthub.com/success',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  successUrl?: string;

  @ApiProperty({
    description: 'URL de cancelamento para redirecionamento se pagamento for cancelado',
    example: 'https://tech-solutions.connecthub.com/plans',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  cancelUrl?: string;
}

export class SignupResponseDto {
  @ApiProperty({
    description: 'Indica se o signup foi bem-sucedido',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensagem de retorno',
    example: 'Empresa criada com sucesso. Verifique seu email para completar a configuração.',
  })
  message: string;

  @ApiProperty({
    description: 'ID do tenant criado',
    example: 'clm1234567890',
  })
  tenantId: string;

  @ApiProperty({
    description: 'URL do checkout do Stripe (se plano for pago)',
    example: 'https://checkout.stripe.com/pay/cs_1234567890',
    required: false,
  })
  checkoutUrl?: string;

  @ApiProperty({
    description: 'Dados da empresa criada',
  })
  tenant: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({
    description: 'Dados do usuário administrador criado',
  })
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  @ApiProperty({
    description: 'Dados do plano escolhido',
  })
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
}

