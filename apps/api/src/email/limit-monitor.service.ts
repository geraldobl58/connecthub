import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SubStatus } from '@prisma/client';

@Injectable()
export class LimitMonitorService {
  private readonly logger = new Logger(LimitMonitorService.name);
  private readonly alertThresholds = [70, 80, 90]; // Enviar alerta em 70%, 80% e 90%

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Executa verificação de limites a cada 6 horas
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async checkLimits() {
    this.logger.log('🔍 Iniciando verificação de limites...');

    try {
      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          status: SubStatus.ACTIVE,
        },
        include: {
          plan: true,
          tenant: {
            include: {
              users: {
                where: {
                  isActive: true,
                },
                take: 1,
              },
            },
          },
        },
      });

      for (const subscription of subscriptions) {
        await this.checkSubscriptionLimits(subscription);
      }

      this.logger.log(
        `✅ Verificação concluída. ${subscriptions.length} subscriptions verificadas.`,
      );
    } catch (error) {
      this.logger.error('❌ Erro ao verificar limites:', error);
    }
  }

  private async checkSubscriptionLimits(subscription: any) {
    const { tenant, plan } = subscription;

    // Verificar limite de usuários
    const usersCount = tenant.users?.length || 0;
    const maxUsers = plan.maxUsers;

    if (maxUsers && maxUsers > 0) {
      const usersPercentage = (usersCount / maxUsers) * 100;

      if (this.shouldSendAlert(usersPercentage)) {
        await this.sendLimitAlert({
          tenant,
          plan,
          limitType: 'Usuários',
          currentUsage: usersCount,
          maxLimit: maxUsers,
          percentageUsed: usersPercentage,
        });
      }
    }

    // Verificar limite de contatos (se houver)
    // TODO: Implementar quando houver modelo de contatos
  }

  private shouldSendAlert(percentageUsed: number): boolean {
    return this.alertThresholds.some(
      (threshold) =>
        percentageUsed >= threshold && percentageUsed < threshold + 10,
    );
  }

  private async sendLimitAlert(data: {
    tenant: any;
    plan: any;
    limitType: string;
    currentUsage: number;
    maxLimit: number;
    percentageUsed: number;
  }) {
    const { tenant, plan, limitType, currentUsage, maxLimit, percentageUsed } =
      data;

    // Buscar admin/manager do tenant
    const admin = tenant.users?.[0];
    if (!admin) {
      this.logger.warn(`⚠️ Nenhum admin encontrado para tenant: ${tenant.id}`);
      return;
    }

    try {
      // Verificar se já enviamos alerta recentemente (últimas 24h)
      const lastAlert = await this.prisma.$queryRaw<any[]>`
        SELECT * FROM "EmailLog"
        WHERE "tenantId" = ${tenant.id}
          AND "type" = 'LIMIT_ALERT'
          AND "limitType" = ${limitType}
          AND "sentAt" > NOW() - INTERVAL '24 hours'
        ORDER BY "sentAt" DESC
        LIMIT 1
      `;

      if (lastAlert && lastAlert.length > 0) {
        this.logger.log(
          `⏭️ Alerta já enviado nas últimas 24h para ${tenant.name} (${limitType})`,
        );
        return;
      }

      // Enviar email
      await this.emailService.sendLimitAlert({
        companyName: tenant.name,
        contactName: admin.name,
        contactEmail: admin.email,
        limitType,
        currentUsage,
        maxLimit,
        percentageUsed,
        planName: plan.name,
      });

      // Registrar envio (se houver tabela de log)
      try {
        await this.prisma.$executeRaw`
          INSERT INTO "EmailLog" ("tenantId", "type", "limitType", "sentAt", "createdAt")
          VALUES (${tenant.id}, 'LIMIT_ALERT', ${limitType}, NOW(), NOW())
        `;
      } catch {
        // Se a tabela não existir, apenas log
        this.logger.warn('⚠️ Tabela EmailLog não existe. Considere criar.');
      }

      this.logger.log(
        `📧 Alerta enviado para ${admin.email} (${tenant.name}) - ${limitType}: ${percentageUsed.toFixed(1)}%`,
      );
    } catch (error) {
      this.logger.error(`❌ Erro ao enviar alerta para ${tenant.name}:`, error);
    }
  }

  /**
   * Método para executar verificação manual (útil para testes)
   */
  async runManualCheck() {
    this.logger.log('🔍 Executando verificação manual de limites...');
    await this.checkLimits();
  }
}
