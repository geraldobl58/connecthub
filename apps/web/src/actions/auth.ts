"use server";

import { authHttpService } from "@/http/auth";
import { LoginValues } from "../schemas/auth";
import { getErrorMessage } from "@/lib/error-utils";
import { LoginResponse, User } from "@/types/auth";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export async function loginAction(
  credentials: LoginValues
): Promise<ActionResult<LoginResponse>> {
  try {
    const response = await authHttpService.login(credentials);

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function getProfileAction(): Promise<ActionResult<User>> {
  try {
    const user = await authHttpService.getProfile();

    return {
      success: true,
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
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
