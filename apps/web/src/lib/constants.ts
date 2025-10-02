/**
 * Constantes centralizadas para evitar string literals duplicadas
 */
export const USER_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  AGENT: "AGENT",
  VIEWER: "VIEWER",
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Administrador",
  [USER_ROLES.MANAGER]: "Gerente",
  [USER_ROLES.AGENT]: "Agente",
  [USER_ROLES.VIEWER]: "Visualizador",
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

export const QUERY_STALE_TIMES = {
  SHORT: 5 * 60 * 1000, // 5 minutos
  MEDIUM: 10 * 60 * 1000, // 10 minutos
  LONG: 30 * 60 * 1000, // 30 minutos
} as const;

export const ERROR_MESSAGES = {
  ACCESS_DENIED: "Apenas administradores podem realizar esta ação.",
  EMAIL_IN_USE: "Email já está em uso neste tenant.",
  INVALID_DATA: "Dados inválidos fornecidos.",
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet.",
  UNKNOWN_ERROR: "Erro desconhecido.",
} as const;
