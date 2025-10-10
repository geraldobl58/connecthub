import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
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
  private readonly logger = new Logger(PlansService.name);

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

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

    let newPlan;

    // Determinar se é upgrade via Stripe ou método tradicional
    if (dto.stripePriceId) {
      // Upgrade via Stripe
      return this.upgradeSubscription(tenantId, dto.stripePriceId);
    } else if (dto.newPlan) {
      // Método tradicional
      // Verificar se o novo plano é superior ao atual
      const currentPlanLevel = this.getPlanLevel(currentSubscription.plan.name);
      const newPlanLevel = this.getPlanLevel(dto.newPlan);

      if (newPlanLevel <= currentPlanLevel) {
        throw new BadRequestException(
          'O novo plano deve ser superior ao plano atual',
        );
      }

      // Buscar o novo plano
      newPlan = await this.prisma.plan.findUnique({
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
    } else {
      throw new BadRequestException('Especifique newPlan ou stripePriceId');
    }
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

    if (subscription.status === SubStatus.CANCELED) {
      throw new BadRequestException('Assinatura já está cancelada');
    }

    // Cancelar no Stripe se existir stripeSubscriptionId
    if (subscription.stripeSubscriptionId) {
      try {
        await this.stripeService.cancelSubscription(
          subscription.stripeSubscriptionId,
        );
      } catch (error) {
        // Log do erro, mas não falha se o Stripe retornar erro
        this.logger.error('Erro ao cancelar assinatura no Stripe:', {
          error: error.message,
          subscriptionId: subscription.stripeSubscriptionId,
          tenantId,
        });
      }
    }

    // Cancelar assinatura no banco local
    await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        status: SubStatus.CANCELED,
        canceledAt: new Date(),
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
    const levels: Record<string, number> = {
      STARTER: 1,
      PROFESSIONAL: 2,
      ENTERPRISE: 3,
    };
    return levels[planName] || 0;
  }

  // ===== NOVOS MÉTODOS PARA INTEGRAÇÃO COM STRIPE =====

  async getAllPlans() {
    return await this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async createCheckoutSession(
    tenantId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    // Buscar o plano pelo priceId
    const plan = await this.prisma.plan.findFirst({
      where: { stripePriceId: priceId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    // Verificar se já existe uma subscription ativa
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { tenant: true },
    });

    if (existingSubscription?.status === SubStatus.ACTIVE) {
      throw new BadRequestException(
        'Já existe uma assinatura ativa para este tenant',
      );
    }

    let customerId: string;

    if (existingSubscription?.stripeCustomerId) {
      customerId = existingSubscription.stripeCustomerId;
    } else {
      // Buscar dados do tenant para criar o customer
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { users: { where: { role: 'ADMIN' }, take: 1 } },
      });

      if (!tenant) {
        throw new NotFoundException('Tenant não encontrado');
      }

      const adminUser = tenant.users[0];
      if (!adminUser) {
        throw new NotFoundException('Usuário administrador não encontrado');
      }

      const customer = await this.stripeService.createCustomer({
        email: adminUser.email,
        name: tenant.name,
        tenantId,
      });

      customerId = customer.id;
    }

    return await this.stripeService.createCheckoutSession(
      priceId,
      customerId,
      successUrl,
      cancelUrl,
      { tenantId },
    );
  }

  async getSubscriptionLimits(tenantId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    return {
      maxUsers: subscription.plan.maxUsers,
      maxProperties: subscription.plan.maxProperties,
      maxContacts: subscription.plan.maxContacts,
      hasAPI: subscription.plan.hasAPI,
    };
  }

  async checkUsageLimits(tenantId: string) {
    const [subscription, usage] = await Promise.all([
      this.prisma.subscription.findUnique({
        where: { tenantId },
        include: { plan: true },
      }),
      this.prisma.usage.findUnique({
        where: { tenantId },
      }),
    ]);

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    const currentUsage = usage || { propertiesCount: 0, contactsCount: 0 };
    const limits = subscription.plan;

    return {
      properties: {
        current: currentUsage.propertiesCount,
        limit: limits.maxProperties,
        canAdd:
          !limits.maxProperties ||
          currentUsage.propertiesCount < limits.maxProperties,
      },
      contacts: {
        current: currentUsage.contactsCount,
        limit: limits.maxContacts,
        canAdd:
          !limits.maxContacts ||
          currentUsage.contactsCount < limits.maxContacts,
      },
      api: {
        enabled: limits.hasAPI,
      },
    };
  }

  async upgradeSubscription(
    tenantId: string,
    newPriceId: string,
  ): Promise<PlanUpgradeResponseDto> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    // Buscar o novo plano
    const newPlan = await this.prisma.plan.findFirst({
      where: { stripePriceId: newPriceId },
    });

    if (!newPlan) {
      throw new NotFoundException('Novo plano não encontrado');
    }

    // Validar se é realmente um upgrade
    const currentPlanLevel = this.getPlanLevel(subscription.plan.name);
    const newPlanLevel = this.getPlanLevel(newPlan.name);

    if (newPlanLevel <= currentPlanLevel) {
      throw new BadRequestException('O novo plano deve ser superior ao atual');
    }

    // Atualizar no Stripe se existir stripeSubscriptionId
    if (subscription.stripeSubscriptionId) {
      try {
        await this.stripeService.updateSubscription(
          subscription.stripeSubscriptionId,
          newPriceId,
        );
      } catch (error) {
        throw new BadRequestException(
          `Erro ao atualizar assinatura no Stripe: ${error.message}`,
        );
      }
    }

    // Atualizar no banco de dados
    const updatedSubscription = await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        planId: newPlan.id,
        renewedAt: new Date(),
      },
      include: { plan: true },
    });

    return {
      success: true,
      message: `Plano atualizado para ${newPlan.name} com sucesso`,
      newPlan: this.mapToPlanInfoDto(newPlan, updatedSubscription),
      nextBillingDate: updatedSubscription.expiresAt?.toISOString() || '',
    };
  }

  async validateSubscription(tenantId: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      return false;
    }

    // Verificar se está ativa e não expirada
    const now = new Date();
    const isActive = subscription.status === SubStatus.ACTIVE;
    const isNotExpired =
      !subscription.expiresAt || subscription.expiresAt > now;

    return isActive && isNotExpired;
  }

  async createBillingPortalSession(
    tenantId: string,
    returnUrl: string,
  ): Promise<string> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (!subscription.stripeCustomerId) {
      throw new BadRequestException(
        'Customer Stripe não encontrado para este tenant',
      );
    }

    return await this.stripeService.createBillingPortalSession(
      subscription.stripeCustomerId,
      returnUrl,
    );
  }

  async getCurrentCompany(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return {
      id: tenant.id,
      name: tenant.name,
      tenantId: tenant.slug,
      domain: `${tenant.slug}.connecthub.com`,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }

  async getPlanUsage(tenantId: string) {
    // Buscar estatísticas atuais do tenant
    const [userCount, propertyCount, ownerCount] = await Promise.all([
      this.prisma.user.count({
        where: { tenantId, deletedAt: null, isActive: true },
      }),
      this.prisma.property.count({
        where: { tenantId, deletedAt: null },
      }),
      this.prisma.owner.count({
        where: { tenantId },
      }),
    ]);

    // Buscar limites do plano atual
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException('Plano não encontrado');
    }

    return {
      currentUsers: userCount,
      currentProperties: propertyCount,
      currentContacts: ownerCount,
      maxUsers: subscription.plan.maxUsers || 0,
      maxProperties: subscription.plan.maxProperties || 0,
      maxContacts: subscription.plan.maxContacts || 0,
    };
  }
}
