import { Role } from "./permissions";

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

// Error types for better error handling
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      statusCode?: number;
    };
  };
  message?: string;
}
