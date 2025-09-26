"use server";

import {
  authService,
  LoginResponse,
  RegisterResponse,
  User,
} from "@/services/auth.service";
import { LoginValues, RegisterValues } from "../schemas/auth";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
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
    return {
      success: false,
      error: authService.getErrorMessage(error),
    };
  }
}

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
    return {
      success: false,
      error: authService.getErrorMessage(error),
    };
  }
}

export async function getProfileAction(): Promise<ActionResult<User>> {
  try {
    const user = await authService.getProfile();

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
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
