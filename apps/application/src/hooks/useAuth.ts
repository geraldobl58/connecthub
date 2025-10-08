import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Tipos de exemplo
interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Simulação de uma API service
const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular resposta da API
    return {
      user: {
        id: "1",
        name: "João Silva",
        email: credentials.email,
      },
      token: "fake-jwt-token",
    };
  },

  getProfile: async (): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: "1",
      name: "João Silva",
      email: "joao@exemplo.com",
    };
  },
};

// Hook para login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Cache dos dados do usuário após login bem-sucedido
      queryClient.setQueryData(["user", "profile"], data.user);

      // Armazenar token (em uma aplicação real, use um storage seguro)
      localStorage.setItem("auth_token", data.token);
    },
    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });
}

// Hook para buscar perfil do usuário
export function useProfile() {
  const token = localStorage.getItem("auth_token");

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => authService.getProfile(),
    enabled: !!token, // Só executa se o token existir
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Limpar token
      localStorage.removeItem("auth_token");
    },
    onSuccess: () => {
      // Limpar todos os dados do cache
      queryClient.clear();
    },
  });
}
