import { useQuery } from "@tanstack/react-query";
import { authService, removeStoredToken, getStoredToken } from "../http/auth";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  permissions: () => [...authKeys.all, "permissions"] as const,
};

// Hook para buscar perfil do usuário - usado pelo AuthProvider
export function useProfile() {
  const token = getStoredToken();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: (failureCount, error: unknown) => {
      // Não retry se for erro 401 (não autorizado)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 401) {
          removeStoredToken();
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}
