import api from "@/lib/api";
import {
  LoginResponse,
  RegisterResponse,
  SignupResponse,
  User,
} from "@/types/auth";

export type { SignupResponse };

import { LoginValues, RegisterValues } from "../schemas/auth";
import { SignupValues } from "../schemas/signup";

export const authHttpService = {
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

    return {
      id: data.userId,
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      tenantId: data.tenantId,
      isActive: true,
      tenant: {
        id: data.tenant.id,
        name: data.tenant.name,
        slug: data.tenant.slug,
        plan: data.tenant.plan,
        planExpiresAt: data.tenant.planExpiresAt,
        createdAt: data.tenant.createdAt,
      },
    };
  },
};
