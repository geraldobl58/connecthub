"use client";

import { useAuth } from "./auth";
import { PermissionManager, Role } from "@/lib/permissions";

/**
 * Hook para gerenciar permissões do usuário atual
 */
export function usePermissions() {
  const { user } = useAuth();

  if (!user) {
    return {
      permissions: null,
      hasPermission: () => false,
      hasRole: () => false,
      canCreateUsers: () => false,
      canManageUsers: () => false,
      canViewUsers: () => false,
      canManageProperties: () => false,
      canViewProperties: () => false,
      canManageLeads: () => false,
      canViewLeads: () => false,
      canManageDeals: () => false,
      canViewDeals: () => false,
      canManageTasks: () => false,
      canViewTasks: () => false,
      canViewReports: () => false,
      canManageSettings: () => false,
      canViewSettings: () => false,
      canManageSubscriptions: () => false,
      canViewSubscriptions: () => false,
    };
  }

  const permissions = new PermissionManager(user.role as Role);

  return {
    permissions,
    hasPermission: (resource: string, action: string) =>
      permissions.hasPermission(resource, action),
    hasRole: (requiredRole: Role) => permissions.hasRole(requiredRole),
    canCreateUsers: () => permissions.canCreateUsers(),
    canManageUsers: () => permissions.canManageUsers(),
    canViewUsers: () => permissions.canViewUsers(),
    canManageProperties: () => permissions.canManageProperties(),
    canViewProperties: () => permissions.canViewProperties(),
    canManageLeads: () => permissions.canManageLeads(),
    canViewLeads: () => permissions.canViewLeads(),
    canManageDeals: () => permissions.canManageDeals(),
    canViewDeals: () => permissions.canViewDeals(),
    canManageTasks: () => permissions.canManageTasks(),
    canViewTasks: () => permissions.canViewTasks(),
    canViewReports: () => permissions.canViewReports(),
    canManageSettings: () => permissions.canManageSettings(),
    canViewSettings: () => permissions.canViewSettings(),
    canManageSubscriptions: () => permissions.canManageSubscriptions(),
    canViewSubscriptions: () => permissions.canViewSubscriptions(),
  };
}
