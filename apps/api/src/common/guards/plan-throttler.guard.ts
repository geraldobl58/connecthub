import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlanThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: any,
    storageService: any,
    reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Usar tenantId como parte da chave de rastreamento
    if (req.user?.tenantId) {
      return `${req.user.tenantId}:${req.ip || 'unknown'}`;
    }
    return req.ip || 'unknown';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Buscar limite baseado no plano
    if (user?.tenantId) {
      const subscription = await this.prisma.subscription.findFirst({
        where: { tenantId: user.tenantId },
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      });

      if (subscription?.plan) {
        const planName = subscription.plan.name.toUpperCase();

        // Armazenar informações do plano no request
        request.planName = planName;

        // Definir limite customizado por plano (requests por hora)
        let customLimit = 100; // STARTER (padrão)
        switch (planName) {
          case 'PROFESSIONAL':
            customLimit = 1000;
            break;
          case 'ENTERPRISE':
            customLimit = 5000;
            break;
          case 'STARTER':
          default:
            customLimit = 100;
            break;
        }

        request.throttlerLimit = customLimit;
      }
    }

    try {
      return await super.canActivate(context);
    } catch (error) {
      if (error instanceof ThrottlerException) {
        const limit = request.throttlerLimit || 100;
        const plan = request.planName || 'STARTER';
        throw new ThrottlerException(
          `Limite de ${limit} requisições por hora excedido para o plano ${plan}. Faça upgrade para aumentar o limite.`,
        );
      }
      throw error;
    }
  }
}
