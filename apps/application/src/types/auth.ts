// Tipos base
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  maxUsers?: number;
  maxProperties?: number;
  maxContacts?: number;
  hasAPI: boolean;
  description?: string;
}

export interface Subscription {
  id: string;
  status: string;
  startedAt: string;
  expiresAt?: string;
  plan: Plan;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings?: Record<string, unknown>;
  subscription?: Subscription;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  tenant: Tenant;
  createdAt: string;
  updatedAt: string;
}

// Requests
export interface AuthRequest {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterRequest {
  tenantId: string;
  name: string;
  email: string;
  password: string;
}

// New signup request for company registration with Stripe
export interface SignupRequest {
  companyName: string;
  contactName: string;
  contactEmail: string;
  domain: string;
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  successUrl: string;
  cancelUrl: string;
}

// Response from signup with Stripe checkout URL
export interface SignupResponse {
  success: boolean;
  message: string;
  tenantId: string;
  checkoutUrl: string;
  tenant: Partial<Tenant>;
  user: Partial<User>;
  plan: Partial<Plan>;
}

// Tipo específico para formulário de registro (inclui confirmPassword)
export interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
  tenantId: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

// Responses
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

// Permission types
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
