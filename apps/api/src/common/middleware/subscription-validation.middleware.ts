import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PlansService } from '../../plans/plans.service';

interface AuthenticatedRequest extends Request {
  user?: {
    tenantId: string;
    [key: string]: any;
  };
}

@Injectable()
export class SubscriptionValidationMiddleware implements NestMiddleware {
  constructor(private plansService: PlansService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Verificar se a request tem um usuário autenticado
    if (!req.user?.tenantId) {
      return next();
    }

    // Lista de rotas que não precisam de validação de plano
    const exemptRoutes = [
      '/auth',
      '/stripe/webhook',
      '/plans',
      '/stripe/subscription-status',
      '/stripe/create-checkout-session',
      '/stripe/create-billing-portal',
    ];

    const isExemptRoute = exemptRoutes.some(route => req.path.startsWith(route));
    if (isExemptRoute) {
      return next();
    }

    try {
      const isValidSubscription = await this.plansService.validateSubscription(req.user.tenantId);
      
      if (!isValidSubscription) {
        throw new ForbiddenException({
          message: 'Assinatura inválida ou expirada',
          code: 'SUBSCRIPTION_REQUIRED',
          action: 'upgrade_plan',
        });
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      // Se houver erro na validação, permitir acesso (para não quebrar o sistema)
      next();
    }
  }
}