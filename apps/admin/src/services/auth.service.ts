import api from "@/lib/api";
import { LoginValues, RegisterValues } from "../schemas/auth";
import { SignupValues } from "../schemas/signup";

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
  };
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

export const authService = {
  /**
   * Fazer login no sistema
   */
  async login(credentials: LoginValues): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * Registrar novo usuário
   */
  async register(userData: RegisterValues): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  /**
   * Cadastrar nova empresa (signup)
   */
  async signup(signupData: SignupValues): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>("/auth/signup", signupData);
    return response.data;
  },

  /**
   * Buscar perfil do usuário autenticado
   */
  async getProfile(): Promise<User> {
    const response = await api.get("/auth/profile");
    const data = response.data;

    // Mapear dados da API para interface User
    return {
      id: data.userId,
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      tenantId: data.tenantId,
      isActive: true, // Assumir true se conseguiu fazer a requisição
      tenant: data.tenant,
    };
  },

  /**
   * Verificar se o erro é de autenticação
   */
  isAuthError(error: unknown): boolean {
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as ApiError;
      return apiError.response?.status === 401;
    }
    return false;
  },

  /**
   * Extrair mensagem de erro da API
   */
  getErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as ApiError;

      if (apiError.response?.data?.message) {
        return apiError.response.data.message;
      }

      if (apiError.response?.status === 401) {
        return "Email ou senha incorretos";
      }

      if (apiError.response?.status === 409) {
        return "Email já está em uso neste tenant";
      }

      if (apiError.response?.status === 400) {
        return "Dados inválidos fornecidos";
      }

      if (apiError.response?.status) {
        return `Erro do servidor (${apiError.response.status})`;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Erro desconhecido";
  },
};
