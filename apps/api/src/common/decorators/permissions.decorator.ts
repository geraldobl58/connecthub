import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export interface RequiredPermission {
  resource: string;
  action: string;
}

/**
 * Decorator para definir permissões necessárias para acessar um endpoint
 * @param permissions Array de permissões necessárias
 *
 * @example
 * @Permissions({ resource: 'users', action: 'create' })
 * @Permissions({ resource: 'users', action: 'read' }, { resource: 'properties', action: 'read' })
 */
export const Permissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Decorator para verificar se o usuário tem permissão para criar usuários
 * Apenas ADMIN pode criar novos usuários
 */
export const RequireUserCreation = () =>
  Permissions({ resource: 'users', action: 'create' });

/**
 * Decorator para verificar se o usuário tem permissão para gerenciar usuários
 * ADMIN e MANAGER podem gerenciar usuários
 */
export const RequireUserManagement = () =>
  Permissions({ resource: 'users', action: 'update' });

/**
 * Decorator para verificar se o usuário tem permissão para visualizar usuários
 * ADMIN, MANAGER e AGENT podem visualizar usuários
 */
export const RequireUserRead = () =>
  Permissions({ resource: 'users', action: 'read' });
