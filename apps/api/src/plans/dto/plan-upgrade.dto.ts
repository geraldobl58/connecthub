import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum PlanType {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export class PlanUpgradeDto {
  @ApiProperty({
    description: 'Novo plano para upgrade',
    enum: PlanType,
    example: PlanType.PROFESSIONAL,
  })
  @IsEnum(PlanType)
  @IsNotEmpty()
  newPlan: PlanType;
}
