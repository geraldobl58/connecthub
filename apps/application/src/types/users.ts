// Tipos de role como const assertion
export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  AGENT: "AGENT",
  VIEWER: "VIEWER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Tipos de usuários baseados na API
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs para requests
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Responses da API
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Para formulários
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
}

// Para filtros
export interface UserFilters {
  search?: string;
  role?: UserRole | "all";
  isActive?: boolean | "all";
}

// Para tabela
export interface UserTableData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  actions?: string;
}

// API Error types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
