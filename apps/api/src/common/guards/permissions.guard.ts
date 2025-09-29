import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from '../decorators/permissions.decorator';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated or role not found');
    }

    // Verifica se o usuário tem todas as permissões necessárias
    const hasAllPermissions = requiredPermissions.every((permission) =>
      this.permissionsService.hasPermission(
        user.role,
        permission.resource,
        permission.action,
      ),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (permission) =>
          !this.permissionsService.hasPermission(
            user.role,
            permission.resource,
            permission.action,
          ),
      );

      throw new ForbiddenException(
        `Insufficient permissions. Missing: ${missingPermissions
          .map((p) => `${p.resource}:${p.action}`)
          .join(', ')}`,
      );
    }

    return true;
  }
}
