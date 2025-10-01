import { Role } from "./permissions";

// Response types matching API
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface UserMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserPaginatedResponse {
  data: UserResponse[];
  meta: UserMeta;
}

// Request types for API calls
export interface CreateUserRequest {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  isActive?: boolean;
}

// Response types for individual operations
export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
