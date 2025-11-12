import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SubStatus } from '@prisma/client';
import Stripe from 'stripe';

export interface UpgradeResult {
  success: boolean;
  tenantId: string;
  oldPlanName: string;
  newPlanName: string;
  message: string;
}

@Injectable()
export class AutoUpgradeService {
  private readonly logger = new Logger(AutoUpgradeService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Processa upgrade automático quando um pagamento é bem-sucedido
   */
  async processAutoUpgrade(
    subscription: Stripe.Subscription,
  ): Promise<UpgradeResult | null> {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      this.logger.warn(
        `No tenantId found in subscription metadata: ${subscription.id}`,
      );
      return null;
    }

    const priceId = subscription.items.data[0]?.price?.id;
    if (!priceId) {
      this.logger.warn(`No price ID found in subscription: ${subscription.id}`);
      return null;
    }

    this.logger.log(`🔄 Processing auto-upgrade for tenant: ${tenantId}`, {
      subscriptionId: subscription.id,
      priceId,
    });

    // Buscar o novo plano baseado no stripePriceId
    const newPlan = await this.prisma.plan.findFirst({
      where: { stripePriceId: priceId },
    });

    if (!newPlan) {
      this.logger.warn(`No plan found for Stripe price: ${priceId}`);
      return null;
    }

    // Buscar assinatura e plano atuais
    const currentSubscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!currentSubscription) {
      this.logger.error(`No subscription found for tenant: ${tenantId}`);
      return null;
    }

    const oldPlanName = currentSubscription.plan.name;
    const newPlanName = newPlan.name;

    // Verificar se é realmente um upgrade (não apenas uma renovação)
    const isUpgrade = this.isPlanUpgrade(oldPlanName, newPlanName);

    // Calcular datas de assinatura
    const startedAt = new Date(
      (subscription as any).current_period_start * 1000,
    );
    const expiresAt = new Date((subscription as any).current_period_end * 1000);
    const status = this.mapStripeStatusToSubStatus(subscription.status);

    // Atualizar assinatura no banco de dados
    await this.prisma.subscription.update({
      where: { tenantId },
      data: {
        planId: newPlan.id,
        status,
        startedAt,
        expiresAt,
        renewedAt: new Date(),
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
      },
    });

    // Registrar log de upgrade
    await this.logUpgrade(tenantId, oldPlanName, newPlanName, subscription.id);

    this.logger.log(`✅ Auto-upgrade completed for tenant: ${tenantId}`, {
      oldPlan: oldPlanName,
      newPlan: newPlanName,
      isUpgrade,
    });

    // Enviar email de confirmação
    if (isUpgrade) {
      await this.sendUpgradeConfirmationEmail(
        tenantId,
        oldPlanName,
        newPlanName,
        expiresAt,
      );
    }

    return {
      success: true,
      tenantId,
      oldPlanName,
      newPlanName,
      message: isUpgrade
        ? `Upgrade automático de ${oldPlanName} para ${newPlanName} realizado com sucesso`
        : `Plano ${newPlanName} renovado com sucesso`,
    };
  }

  /**
   * Verifica se é um upgrade (mudança para plano superior)
   */
  private isPlanUpgrade(oldPlanName: string, newPlanName: string): boolean {
    const planLevels: Record<string, number> = {
      STARTER: 1,
      PROFESSIONAL: 2,
      ENTERPRISE: 3,
    };

    const oldLevel = planLevels[oldPlanName.toUpperCase()] || 0;
    const newLevel = planLevels[newPlanName.toUpperCase()] || 0;

    return newLevel > oldLevel;
  }

  /**
   * Mapeia status do Stripe para status interno
   */
  private mapStripeStatusToSubStatus(stripeStatus: string): SubStatus {
    switch (stripeStatus) {
      case 'active':
        return SubStatus.ACTIVE;
      case 'past_due':
        return SubStatus.PAST_DUE;
      case 'canceled':
      case 'unpaid':
        return SubStatus.CANCELED;
      case 'incomplete_expired':
        return SubStatus.EXPIRED;
      default:
        return SubStatus.CANCELED;
    }
  }

  /**
   * Registra o upgrade no histórico
   */
  private async logUpgrade(
    tenantId: string,
    oldPlanName: string,
    newPlanName: string,
    stripeSubscriptionId: string,
  ): Promise<void> {
    try {
      // Você pode criar uma tabela de histórico de upgrades se desejar
      // Por enquanto, vamos apenas logar
      this.logger.log('📝 Upgrade logged', {
        tenantId,
        oldPlan: oldPlanName,
        newPlan: newPlanName,
        stripeSubscriptionId,
        timestamp: new Date().toISOString(),
      });

      // TODO: Opcional - Criar tabela PlanUpgradeHistory
      // await this.prisma.planUpgradeHistory.create({
      //   data: {
      //     tenantId,
      //     oldPlanName,
      //     newPlanName,
      //     stripeSubscriptionId,
      //     upgradedAt: new Date(),
      //   },
      // });
    } catch (error) {
      this.logger.error('Failed to log upgrade', error);
      // Não falha o processo se o log der erro
    }
  }

  /**
   * Envia email de confirmação de upgrade
   */
  private async sendUpgradeConfirmationEmail(
    tenantId: string,
    oldPlanName: string,
    newPlanName: string,
    expiresAt: Date,
  ): Promise<void> {
    try {
      // Buscar informações do tenant e admin
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        this.logger.warn(`Tenant ${tenantId} not found`);
        return;
      }

      const adminUser = await this.prisma.user.findFirst({
        where: { tenantId, isActive: true },
      });

      if (!adminUser) {
        this.logger.warn(
          `No admin user found for tenant ${tenantId} to send upgrade email`,
        );
        return;
      }
      const planFeatures = this.getPlanFeatures(newPlanName);

      // Enviar email usando sendWelcomeEmail adaptado para notificação de upgrade
      await this.emailService.sendWelcomeEmail({
        companyName: tenant.name,
        contactName: adminUser.name,
        contactEmail: adminUser.email,
        domain: tenant.slug,
        tenantId,
        planName: newPlanName,
        planFeatures: `Upgrade de ${oldPlanName} para ${newPlanName}`,
        subdomain: tenant.slug,
        plan: newPlanName,
      });

      this.logger.log(
        `📧 Upgrade confirmation email sent to: ${adminUser.email}`,
      );
    } catch (error) {
      this.logger.error('Failed to send upgrade confirmation email', error);
      // Não falha o processo se o email der erro
    }
  }

  /**
   * Retorna descrição dos recursos do plano
   */
  private getPlanFeatures(planName: string): string {
    switch (planName.toUpperCase()) {
      case 'STARTER':
        return 'Até 4 usuários, 3 propriedades, 10 contatos';
      case 'PROFESSIONAL':
        return 'Até 4 usuários, 10 propriedades, 20 contatos + API';
      case 'ENTERPRISE':
        return 'Até 4 usuários, 50 propriedades, 30 contatos + API';
      default:
        return '';
    }
  }
}
