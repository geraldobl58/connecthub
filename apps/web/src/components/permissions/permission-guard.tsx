"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/auth";
import { PermissionManager, Role } from "@/lib/permissions";

interface PermissionGuardProps {
  children: ReactNode;
  resource: string;
  action: string;
  fallback?: ReactNode;
  requireAll?: boolean;
}

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: Role;
  fallback?: ReactNode;
}

interface PermissionCheckProps {
  children: ReactNode;
  check: (permissions: PermissionManager) => boolean;
  fallback?: ReactNode;
}

/**
 * Componente que renderiza children apenas se o usuário tem a permissão específica
 */
export function PermissionGuard({
  children,
  resource,
  action,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const permissions = new PermissionManager(user.role as Role);
  const hasPermission = permissions.hasPermission(resource, action);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Componente que renderiza children apenas se o usuário tem a role necessária ou superior
 */
export function RoleGuard({
  children,
  requiredRole,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const permissions = new PermissionManager(user.role as Role);
  const hasRole = permissions.hasRole(requiredRole);

  return hasRole ? <>{children}</> : <>{fallback}</>;
}

/**
 * Componente que renderiza children baseado em uma função de verificação customizada
 */
export function PermissionCheck({
  children,
  check,
  fallback = null,
}: PermissionCheckProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const permissions = new PermissionManager(user.role as Role);
  const hasPermission = check(permissions);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Componentes específicos para permissões comuns
 */

export function AdminOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRole={Role.ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ManagerOrAbove({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRole={Role.MANAGER} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AgentOrAbove({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRole={Role.AGENT} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function CanCreateUsers({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canCreateUsers()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanManageUsers({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canManageUsers()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewUsers({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewUsers()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanManageProperties({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canManageProperties()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewProperties({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewProperties()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanManageLeads({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canManageLeads()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewLeads({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewLeads()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanManageDeals({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canManageDeals()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewDeals({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewDeals()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanManageTasks({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canManageTasks()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewTasks({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewTasks()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewReports({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewReports()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanManageSettings({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canManageSettings()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}

export function CanViewSettings({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionCheck
      check={(permissions) => permissions.canViewSettings()}
      fallback={fallback}
    >
      {children}
    </PermissionCheck>
  );
}
