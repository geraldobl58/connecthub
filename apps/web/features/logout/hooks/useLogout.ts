"use client";

import { useState } from "react";
import { deleteCookie } from "cookies-next";
import { logoutAction } from "../actions";

/**
 * Hook para gerenciar logout do usuário
 * Remove token do cookie e redireciona para sign-in
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Remove token from cookie
      deleteCookie("access_token");

      // Chamar server action para logout
      await logoutAction();

      // Se chegar aqui, foi um erro (já que logoutAction faz redirect)
      setError("Erro ao fazer logout");
    } catch (error) {
      console.error("Logout error:", error);

      // Se é um NEXT_REDIRECT, deixar passar (é esperado)
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        // Redirect foi disparado, isso é esperado
        return;
      }

      setError("Erro inesperado ao fazer logout");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
}
