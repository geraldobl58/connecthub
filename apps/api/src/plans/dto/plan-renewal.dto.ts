import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlanType } from './plan-upgrade.dto';

export class PlanRenewalDto {
  @ApiProperty({
    description: 'Plano para renovação',
    enum: PlanType,
    example: PlanType.PROFESSIONAL,
  })
  @IsEnum(PlanType)
  @IsNotEmpty()
  plan: PlanType;

  @ApiProperty({
    description: 'Método de pagamento (opcional)',
    example: 'credit_card',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
