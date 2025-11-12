"use server";

import { redirect } from "next/navigation";

export type LogoutActionState = {
  success: boolean;
  message?: string;
};

/**
 * Server Action para realizar logout do usuário
 * Remove dados de autenticação e redireciona para sign-in
 * @returns Resultado da ação com status de sucesso
 */
export async function logoutAction(): Promise<LogoutActionState> {
  try {
    redirect("/auth/sign-in");
  } catch (error) {
    // Se o redirect foi disparado, deixar passar
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: "Erro ao fazer logout. Tente novamente.",
    };
  }
}
