import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanUpgradeDto } from './dto/plan-upgrade.dto';
import { PlanRenewalDto } from './dto/plan-renewal.dto';
import {
  PlanInfoDto,
  PlanUpgradeResponseDto,
  PlanRenewalResponseDto,
  PlanCancelResponseDto,
} from './dto/plan-response.dto';
import { SubStatus } from '@prisma/client';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async getCurrentPlan(tenantId: string): Promise<PlanInfoDto> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Plano não encontrado para este tenant');
    }

    return this.mapToPlanInfoDto(subscription.plan, subscription);
  }

  async upgradePlan(
    tenantId: string,
    dto: PlanUpgradeDto,
  ): Promise<PlanUpgradeResponseDto> {
    // Buscar assinatura atual
    const currentSubscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!currentSubscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    // Verificar se o novo plano é superior ao atual
    const currentPlanLevel = this.getPlanLevel(currentSubscription.plan.name);
    const newPlanLevel = this.getPlanLevel(dto.newPlan);

    if (newPlanLevel <= currentPlanLevel) {
      throw new BadRequestException(
        'O novo plano deve ser superior ao plano atual',
      );
    }

    // Buscar o novo plano
    const newPlan = await this.prisma.plan.findUnique({
      where: { name: dto.newPlan },
    });

    if (!newPlan) {
      throw new NotFoundException('Plano não encontrado');
    }

    // Calcular nova data de expiração (manter o tempo restante + 30 dias)
    const now = new Date();
    const currentExpiresAt = currentSubscription.expiresAt || now;
    const timeRemaining = currentExpiresAt.getTime() - now.getTime();
    const newExpiresAt = new Date(
      now.getTime() + timeRemaining + 30 * 24 * 60 * 60 * 1000,
    );

    // Atualizar assinatura
    const updatedSubscription = await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        planId: newPlan.id,
        expiresAt: newExpiresAt,
        renewedAt: now,
      },
      include: { plan: true },
    });

    return {
      success: true,
      message: `Plano atualizado para ${newPlan.name} com sucesso`,
      newPlan: this.mapToPlanInfoDto(newPlan, updatedSubscription),
      nextBillingDate: newExpiresAt.toISOString(),
    };
  }

  async renewPlan(
    tenantId: string,
    dto: PlanRenewalDto,
  ): Promise<PlanRenewalResponseDto> {
    // Buscar assinatura atual
    const currentSubscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!currentSubscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    // Buscar o plano para renovação
    const plan = await this.prisma.plan.findUnique({
      where: { name: dto.plan },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    // Calcular nova data de expiração (30 dias a partir de agora)
    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Atualizar assinatura
    const updatedSubscription = await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        planId: plan.id,
        status: SubStatus.ACTIVE,
        expiresAt: newExpiresAt,
        renewedAt: now,
      },
      include: { plan: true },
    });

    return {
      success: true,
      message: `Plano ${plan.name} renovado com sucesso`,
      plan: this.mapToPlanInfoDto(plan, updatedSubscription),
      nextBillingDate: newExpiresAt.toISOString(),
    };
  }

  async cancelPlan(tenantId: string): Promise<PlanCancelResponseDto> {
    // Buscar assinatura atual
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    // Cancelar assinatura
    await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        status: SubStatus.CANCELED,
      },
    });

    return {
      success: true,
      message: 'Plano cancelado com sucesso',
    };
  }

  async getPlanHistory(tenantId: string): Promise<PlanInfoDto[]> {
    // Por enquanto, retornar apenas o plano atual
    // Em uma implementação completa, você teria uma tabela de histórico
    const currentPlan = await this.getCurrentPlan(tenantId);
    return [currentPlan];
  }

  private mapToPlanInfoDto(plan: any, subscription: any): PlanInfoDto {
    const now = new Date();
    const expiresAt = subscription.expiresAt || now;
    const isExpired = expiresAt < now;
    const isTrial =
      subscription.status === SubStatus.ACTIVE && !subscription.renewedAt;

    let status: 'ACTIVE' | 'EXPIRED' | 'TRIAL' | 'CANCELLED';
    if (subscription.status === SubStatus.CANCELED) {
      status = 'CANCELLED';
    } else if (isExpired) {
      status = 'EXPIRED';
    } else if (isTrial) {
      status = 'TRIAL';
    } else {
      status = 'ACTIVE';
    }

    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      maxUsers: plan.maxUsers,
      maxProperties: plan.maxProperties,
      maxContacts: plan.maxContacts,
      hasAPI: plan.hasAPI,
      description: plan.description,
      planExpiresAt: expiresAt.toISOString(),
      createdAt: subscription.startedAt.toISOString(),
      status,
    };
  }

  private getPlanLevel(planName: string): number {
    const levels = {
      STARTER: 1,
      PROFESSIONAL: 2,
      ENTERPRISE: 3,
    };
    return levels[planName] || 0;
  }
}
