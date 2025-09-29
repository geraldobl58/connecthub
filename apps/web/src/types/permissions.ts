/**
 * Tipos e interfaces para o sistema de permissões
 */

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  AGENT = "AGENT",
  VIEWER = "VIEWER",
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

export interface RequiredPermission {
  resource: string;
  action: string;
}

export interface MenuPermission {
  resource: string;
  action: string;
}

export interface SubItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: MenuPermission;
}

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: React.ReactNode;
  subitems?: SubItem[];
  permission?: MenuPermission;
}

/**
 * Hierarquia de roles (maior número = maior privilégio)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.ADMIN]: 4,
  [Role.MANAGER]: 3,
  [Role.AGENT]: 2,
  [Role.VIEWER]: 1,
};

/**
 * Recursos disponíveis no sistema
 */
export enum Resource {
  USERS = "users",
  TENANTS = "tenants",
  PROPERTIES = "properties",
  LEADS = "leads",
  DEALS = "deals",
  TASKS = "tasks",
  REPORTS = "reports",
  SETTINGS = "settings",
  SUBSCRIPTIONS = "subscriptions",
}

/**
 * Ações disponíveis no sistema
 */
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

/**
 * Permissões pré-definidas para facilitar o uso
 */
export const PERMISSIONS = {
  // Usuários
  USERS_CREATE: { resource: Resource.USERS, action: Action.CREATE },
  USERS_READ: { resource: Resource.USERS, action: Action.READ },
  USERS_UPDATE: { resource: Resource.USERS, action: Action.UPDATE },
  USERS_DELETE: { resource: Resource.USERS, action: Action.DELETE },

  // Propriedades
  PROPERTIES_CREATE: { resource: Resource.PROPERTIES, action: Action.CREATE },
  PROPERTIES_READ: { resource: Resource.PROPERTIES, action: Action.READ },
  PROPERTIES_UPDATE: { resource: Resource.PROPERTIES, action: Action.UPDATE },
  PROPERTIES_DELETE: { resource: Resource.PROPERTIES, action: Action.DELETE },

  // Leads
  LEADS_CREATE: { resource: Resource.LEADS, action: Action.CREATE },
  LEADS_READ: { resource: Resource.LEADS, action: Action.READ },
  LEADS_UPDATE: { resource: Resource.LEADS, action: Action.UPDATE },
  LEADS_DELETE: { resource: Resource.LEADS, action: Action.DELETE },

  // Deals
  DEALS_CREATE: { resource: Resource.DEALS, action: Action.CREATE },
  DEALS_READ: { resource: Resource.DEALS, action: Action.READ },
  DEALS_UPDATE: { resource: Resource.DEALS, action: Action.UPDATE },
  DEALS_DELETE: { resource: Resource.DEALS, action: Action.DELETE },

  // Tarefas
  TASKS_CREATE: { resource: Resource.TASKS, action: Action.CREATE },
  TASKS_READ: { resource: Resource.TASKS, action: Action.READ },
  TASKS_UPDATE: { resource: Resource.TASKS, action: Action.UPDATE },
  TASKS_DELETE: { resource: Resource.TASKS, action: Action.DELETE },

  // Relatórios
  REPORTS_READ: { resource: Resource.REPORTS, action: Action.READ },

  // Configurações
  SETTINGS_READ: { resource: Resource.SETTINGS, action: Action.READ },
  SETTINGS_UPDATE: { resource: Resource.SETTINGS, action: Action.UPDATE },

  // Assinaturas
  SUBSCRIPTIONS_READ: { resource: Resource.SUBSCRIPTIONS, action: Action.READ },
  SUBSCRIPTIONS_UPDATE: {
    resource: Resource.SUBSCRIPTIONS,
    action: Action.UPDATE,
  },
} as const;
