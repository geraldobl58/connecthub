"use server";

import { HTTPError } from "ky";
import { getProfile } from "../http";

export type GetProfileActionState = {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    username: string;
    email: string;
    tenantId: string;
    planName: string;
    expiresAt: string;
    avatar?: string | null;
    twoFactorEnabled: boolean;
  };
};

/**
 * Server Action to fetch current user profile
 * Retrieves profile data from API and returns formatted response
 * @returns Result with profile data or error message
 */
export async function getProfileAction(): Promise<GetProfileActionState> {
  try {
    // Log para debug (remover em producao)
    console.log("[GetProfile Debug] Fetching user profile");

    // Call the API to get profile
    const response = await getProfile();

    if (!response.success) {
      console.error("[GetProfile API Error]", {
        message: "Failed to fetch profile",
      });

      return {
        success: false,
        message: "Falha ao buscar perfil. Tente novamente.",
      };
    }

    return {
      success: true,
      message: "Perfil obtido com sucesso",
      data: response.data,
    };
  } catch (error) {
    console.error("[GetProfile Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message || "Erro ao buscar perfil. Tente novamente.",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor.",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado. Tente novamente mais tarde.",
    };
  }
}

