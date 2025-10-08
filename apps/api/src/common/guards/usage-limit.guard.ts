import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlansService } from '../../plans/plans.service';

export const USAGE_LIMIT_KEY = 'usageLimit';

export interface UsageLimitOptions {
  resource: 'properties' | 'contacts' | 'users';
  action?: 'create' | 'update' | 'delete';
}

export const UsageLimit = (options: UsageLimitOptions) => 
  SetMetadata(USAGE_LIMIT_KEY, options);

function SetMetadata(key: string, value: any) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(key, value, target);
    return target;
  };
}

@Injectable()
export class UsageLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private plansService: PlansService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const usageLimitOptions = this.reflector.getAllAndOverride<UsageLimitOptions>(
      USAGE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!usageLimitOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.tenantId) {
      return true; // Deixar para outros guards validarem autenticação
    }

    // Só verificar limites para ações de criação
    if (usageLimitOptions.action && usageLimitOptions.action !== 'create') {
      return true;
    }

    try {
      const usageLimits = await this.plansService.checkUsageLimits(user.tenantId);
      
      switch (usageLimitOptions.resource) {
        case 'properties':
          if (!usageLimits.properties.canAdd) {
            throw new ForbiddenException({
              message: `Limite de propriedades atingido. Máximo: ${usageLimits.properties.limit}`,
              code: 'PROPERTY_LIMIT_EXCEEDED',
              action: 'upgrade_plan',
              current: usageLimits.properties.current,
              limit: usageLimits.properties.limit,
            });
          }
          break;
        
        case 'contacts':
          if (!usageLimits.contacts.canAdd) {
            throw new ForbiddenException({
              message: `Limite de contatos atingido. Máximo: ${usageLimits.contacts.limit}`,
              code: 'CONTACT_LIMIT_EXCEEDED',
              action: 'upgrade_plan',
              current: usageLimits.contacts.current,
              limit: usageLimits.contacts.limit,
            });
          }
          break;
        
        default:
          return true;
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      // Em caso de erro, permitir acesso (para não quebrar o sistema)
      return true;
    }
  }
}