"use server";

import { authService, LoginResponse, RegisterResponse, User } from "@/services/auth.service";
import { LoginValues, RegisterValues } from "../schemas/auth";

// Generic action result type
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server action para login
 */
export async function loginAction(
  credentials: LoginValues
): Promise<ActionResult<LoginResponse>> {
  try {
    const response = await authService.login(credentials);

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro no login:", error);

    return {
      success: false,
      error: authService.getErrorMessage(error),
    };
  }
}

/**
 * Server action para registro
 */
export async function registerAction(
  userData: RegisterValues
): Promise<ActionResult<RegisterResponse>> {
  try {
    const response = await authService.register(userData);

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error("Erro no registro:", error);

    return {
      success: false,
      error: authService.getErrorMessage(error),
    };
  }
}

/**
 * Server action para buscar perfil
 */
export async function getProfileAction(): Promise<ActionResult<User>> {
  try {
    const user = await authService.getProfile();

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar perfil:", error);

    return {
      success: false,
      error: authService.getErrorMessage(error),
    };
  }
}

// Backward compatibility
export interface LoginResult {
  success: boolean;
  data?: {
    access_token: string;
  };
  error?: string;
}
