/**
 * Sistema de permissões para o frontend
 * Baseado no sistema de roles do backend
 */

import type { Permission } from "@/types/permissions";
import { Role, ROLE_HIERARCHY } from "@/types/permissions";

// Re-exportar Role para uso em outros arquivos
export type { Role };

// Definir interface local para mapeamento de permissões
interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

/**
 * Mapeamento de permissões por role
 * Deve estar sincronizado com o backend
 */
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: Role.ADMIN,
    permissions: [
      { resource: "users", actions: ["create", "read", "update", "delete"] },
      { resource: "tenants", actions: ["create", "read", "update", "delete"] },
      {
        resource: "properties",
        actions: ["create", "read", "update", "delete"],
      },
      { resource: "leads", actions: ["create", "read", "update", "delete"] },
      { resource: "deals", actions: ["create", "read", "update", "delete"] },
      { resource: "tasks", actions: ["create", "read", "update", "delete"] },
      { resource: "reports", actions: ["read"] },
      { resource: "settings", actions: ["read", "update"] },
      { resource: "subscriptions", actions: ["read", "update"] },
    ],
  },
  {
    role: Role.MANAGER,
    permissions: [
      { resource: "users", actions: ["read", "update"] },
      {
        resource: "properties",
        actions: ["create", "read", "update", "delete"],
      },
      { resource: "leads", actions: ["create", "read", "update", "delete"] },
      { resource: "deals", actions: ["create", "read", "update", "delete"] },
      { resource: "tasks", actions: ["create", "read", "update", "delete"] },
      { resource: "reports", actions: ["read"] },
      { resource: "settings", actions: ["read"] },
    ],
  },
  {
    role: Role.AGENT,
    permissions: [
      { resource: "properties", actions: ["read"] },
      { resource: "leads", actions: ["create", "read", "update"] },
      { resource: "deals", actions: ["create", "read", "update"] },
      { resource: "tasks", actions: ["create", "read", "update"] },
      { resource: "reports", actions: ["read"] },
    ],
  },
  {
    role: Role.VIEWER,
    permissions: [
      { resource: "properties", actions: ["read"] },
      { resource: "leads", actions: ["read"] },
      { resource: "deals", actions: ["read"] },
      { resource: "tasks", actions: ["read"] },
      { resource: "reports", actions: ["read"] },
    ],
  },
];

/**
 * Classe para gerenciar permissões do usuário
 */
export class PermissionManager {
  private userRole: Role;
  private userPermissions: Permission[];

  constructor(userRole: Role) {
    this.userRole = userRole;
    this.userPermissions = this.getRolePermissions(userRole);
  }

  /**
   * Verifica se o usuário tem permissão para uma ação específica
   */
  hasPermission(resource: string, action: string): boolean {
    const permission = this.userPermissions.find(
      (p) => p.resource === resource
    );
    return permission ? permission.actions.includes(action) : false;
  }

  /**
   * Verifica se o usuário tem acesso a um recurso
   */
  hasResourceAccess(resource: string): boolean {
    return this.userPermissions.some((p) => p.resource === resource);
  }

  /**
   * Verifica se o usuário tem uma role específica ou superior
   */
  hasRole(requiredRole: Role): boolean {
    const userLevel = ROLE_HIERARCHY[this.userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];
    return userLevel >= requiredLevel;
  }

  /**
   * Retorna todas as permissões do usuário
   */
  getPermissions(): Permission[] {
    return this.userPermissions;
  }

  /**
   * Retorna a role do usuário
   */
  getRole(): Role {
    return this.userRole;
  }

  /**
   * Verifica se pode criar usuários (apenas ADMIN)
   */
  canCreateUsers(): boolean {
    return this.hasPermission("users", "create");
  }

  /**
   * Verifica se pode gerenciar usuários
   */
  canManageUsers(): boolean {
    return (
      this.hasPermission("users", "update") ||
      this.hasPermission("users", "delete")
    );
  }

  /**
   * Verifica se pode visualizar usuários
   */
  canViewUsers(): boolean {
    return this.hasPermission("users", "read");
  }

  /**
   * Verifica se pode gerenciar propriedades
   */
  canManageProperties(): boolean {
    return (
      this.hasPermission("properties", "create") ||
      this.hasPermission("properties", "update") ||
      this.hasPermission("properties", "delete")
    );
  }

  /**
   * Verifica se pode visualizar propriedades
   */
  canViewProperties(): boolean {
    return this.hasPermission("properties", "read");
  }

  /**
   * Verifica se pode gerenciar leads
   */
  canManageLeads(): boolean {
    return (
      this.hasPermission("leads", "create") ||
      this.hasPermission("leads", "update") ||
      this.hasPermission("leads", "delete")
    );
  }

  /**
   * Verifica se pode visualizar leads
   */
  canViewLeads(): boolean {
    return this.hasPermission("leads", "read");
  }

  /**
   * Verifica se pode gerenciar deals
   */
  canManageDeals(): boolean {
    return (
      this.hasPermission("deals", "create") ||
      this.hasPermission("deals", "update") ||
      this.hasPermission("deals", "delete")
    );
  }

  /**
   * Verifica se pode visualizar deals
   */
  canViewDeals(): boolean {
    return this.hasPermission("deals", "read");
  }

  /**
   * Verifica se pode gerenciar tarefas
   */
  canManageTasks(): boolean {
    return (
      this.hasPermission("tasks", "create") ||
      this.hasPermission("tasks", "update") ||
      this.hasPermission("tasks", "delete")
    );
  }

  /**
   * Verifica se pode visualizar tarefas
   */
  canViewTasks(): boolean {
    return this.hasPermission("tasks", "read");
  }

  /**
   * Verifica se pode visualizar relatórios
   */
  canViewReports(): boolean {
    return this.hasPermission("reports", "read");
  }

  /**
   * Verifica se pode gerenciar configurações
   */
  canManageSettings(): boolean {
    return this.hasPermission("settings", "update");
  }

  /**
   * Verifica se pode visualizar configurações
   */
  canViewSettings(): boolean {
    return this.hasPermission("settings", "read");
  }

  /**
   * Verifica se pode gerenciar assinaturas
   */
  canManageSubscriptions(): boolean {
    return this.hasPermission("subscriptions", "update");
  }

  /**
   * Verifica se pode visualizar assinaturas
   */
  canViewSubscriptions(): boolean {
    return this.hasPermission("subscriptions", "read");
  }

  /**
   * Retorna as permissões de uma role específica
   */
  private getRolePermissions(role: Role): Permission[] {
    const rolePermission = ROLE_PERMISSIONS.find((rp) => rp.role === role);
    return rolePermission ? rolePermission.permissions : [];
  }
}

/**
 * Hook para usar permissões em componentes React
 */
export function usePermissions(userRole: Role): PermissionManager {
  return new PermissionManager(userRole);
}

/**
 * Utilitários para verificação rápida de permissões
 */
export const PermissionUtils = {
  /**
   * Verifica se uma role tem permissão para uma ação
   */
  hasPermission(role: Role, resource: string, action: string): boolean {
    const manager = new PermissionManager(role);
    return manager.hasPermission(resource, action);
  },

  /**
   * Verifica se uma role tem acesso a um recurso
   */
  hasResourceAccess(role: Role, resource: string): boolean {
    const manager = new PermissionManager(role);
    return manager.hasResourceAccess(resource);
  },

  /**
   * Verifica se uma role é superior ou igual a outra
   */
  hasRole(role: Role, requiredRole: Role): boolean {
    const userLevel = ROLE_HIERARCHY[role];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];
    return userLevel >= requiredLevel;
  },

  /**
   * Retorna todas as permissões de uma role
   */
  getRolePermissions(role: Role): Permission[] {
    const rolePermission = ROLE_PERMISSIONS.find((rp) => rp.role === role);
    return rolePermission ? rolePermission.permissions : [];
  },

  /**
   * Retorna todas as roles e suas permissões
   */
  getAllRolePermissions(): RolePermissions[] {
    return ROLE_PERMISSIONS;
  },
};
