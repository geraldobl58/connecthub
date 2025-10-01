// Response types matching API
export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    planExpiresAt: string;
    createdAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  temporaryPassword?: string;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    planExpiresAt: string;
    createdAt: string;
  };
}
