import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

@Injectable()
export class PermissionsService {
  private readonly rolePermissions: RolePermissions[] = [
    {
      role: Role.ADMIN,
      permissions: [
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        {
          resource: 'tenants',
          actions: ['create', 'read', 'update', 'delete'],
        },
        {
          resource: 'properties',
          actions: ['create', 'read', 'update', 'delete'],
        },
        { resource: 'leads', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'tasks', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'reports', actions: ['read'] },
        { resource: 'settings', actions: ['read', 'update'] },
        { resource: 'subscriptions', actions: ['read', 'update'] },
      ],
    },
    {
      role: Role.MANAGER,
      permissions: [
        { resource: 'users', actions: ['read', 'update'] },
        {
          resource: 'properties',
          actions: ['create', 'read', 'update', 'delete'],
        },
        { resource: 'leads', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'tasks', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'reports', actions: ['read'] },
        { resource: 'settings', actions: ['read'] },
      ],
    },
    {
      role: Role.AGENT,
      permissions: [
        { resource: 'properties', actions: ['read'] },
        { resource: 'leads', actions: ['create', 'read', 'update'] },
        { resource: 'deals', actions: ['create', 'read', 'update'] },
        { resource: 'tasks', actions: ['create', 'read', 'update'] },
        { resource: 'reports', actions: ['read'] },
      ],
    },
    {
      role: Role.VIEWER,
      permissions: [
        { resource: 'properties', actions: ['read'] },
        { resource: 'leads', actions: ['read'] },
        { resource: 'deals', actions: ['read'] },
        { resource: 'tasks', actions: ['read'] },
        { resource: 'reports', actions: ['read'] },
      ],
    },
  ];

  /**
   * Verifica se um usuário com determinada role tem permissão para uma ação específica
   */
  hasPermission(role: Role, resource: string, action: string): boolean {
    const rolePermission = this.rolePermissions.find((rp) => rp.role === role);

    if (!rolePermission) {
      return false;
    }

    const permission = rolePermission.permissions.find(
      (p) => p.resource === resource,
    );

    if (!permission) {
      return false;
    }

    return permission.actions.includes(action);
  }

  /**
   * Retorna todas as permissões de uma role
   */
  getRolePermissions(role: Role): Permission[] {
    const rolePermission = this.rolePermissions.find((rp) => rp.role === role);
    return rolePermission ? rolePermission.permissions : [];
  }

  /**
   * Retorna todas as roles e suas permissões
   */
  getAllRolePermissions(): RolePermissions[] {
    return this.rolePermissions;
  }

  /**
   * Verifica se uma role tem acesso a um recurso específico
   */
  hasResourceAccess(role: Role, resource: string): boolean {
    const rolePermission = this.rolePermissions.find((rp) => rp.role === role);

    if (!rolePermission) {
      return false;
    }

    return rolePermission.permissions.some((p) => p.resource === resource);
  }

  /**
   * Retorna as roles que podem executar uma ação específica em um recurso
   */
  getRolesWithPermission(resource: string, action: string): Role[] {
    return this.rolePermissions
      .filter((rp) => this.hasPermission(rp.role, resource, action))
      .map((rp) => rp.role);
  }
}
