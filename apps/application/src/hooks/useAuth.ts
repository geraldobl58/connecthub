import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  authService, 
  setStoredToken, 
  removeStoredToken, 
  getStoredToken 
} from "../http/auth";
import type { 
  AuthRequest, 
  RegisterRequest, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest
} from "../types/auth";

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  permissions: () => [...authKeys.all, 'permissions'] as const,
};

// Hook para login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: AuthRequest) => {
      const response = await authService.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      // Armazenar token
      setStoredToken(data.access_token);
      
      // Cache dos dados do usuário
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Invalidar outras queries relacionadas à auth
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Erro no login:', error);
      removeStoredToken();
    },
  });
}

// Hook para registro
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authService.register(data);
      return response;
    },
    onSuccess: (data) => {
      // Armazenar token
      setStoredToken(data.access_token);
      
      // Cache dos dados do usuário
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Invalidar outras queries relacionadas à auth
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('Erro no registro:', error);
    },
  });
}

// Hook para logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.warn('Erro no logout do servidor:', error);
      } finally {
        // Sempre limpar o token local
        removeStoredToken();
      }
    },
    onSuccess: () => {
      // Limpar todos os dados do cache
      queryClient.clear();
    },
  });
}

// Hook para buscar perfil do usuário
export function useProfile() {
  const token = getStoredToken();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: (failureCount, error: unknown) => {
      // Não retry se for erro 401 (não autorizado)
      if (error && typeof error === 'object' && 'response' in error) {
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

// Hook para atualizar perfil
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await authService.updateProfile(data);
      return response;
    },
    onSuccess: (data) => {
      // Atualizar cache do perfil
      queryClient.setQueryData(authKeys.profile(), data);
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error('Erro ao atualizar perfil:', error);
    },
  });
}

// Hook para recuperar senha
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await authService.forgotPassword(data);
      return response;
    },
    onError: (error) => {
      console.error('Erro ao recuperar senha:', error);
    },
  });
}

// Hook para redefinir senha
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await authService.resetPassword(data);
      return response;
    },
    onError: (error) => {
      console.error('Erro ao redefinir senha:', error);
    },
  });
}

// Hook para verificar autenticação
export function useAuth() {
  const token = getStoredToken();
  const { data: user, isLoading, error } = useProfile();

  return {
    user: user || null,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
  };
}

// Hook para verificar se o usuário tem uma permissão específica
export function usePermission(permission: string) {
  const { user } = useAuth();
  
  // TODO: Implementar lógica de verificação de permissões baseada no 'permission'
  // Por exemplo: user.permissions?.includes(permission)
  console.log('Checking permission:', permission); // Para evitar warning de variável não utilizada
  
  return {
    hasPermission: user?.role === 'admin' || user?.role === 'owner', // Lógica simplificada
    isLoading: false,
  };
}

// Hook para verificar múltiplas permissões
export function usePermissions(permissions: string[]) {
  const { user } = useAuth();
  
  const results = permissions.map(permission => ({
    permission,
    hasPermission: user?.role === 'admin' || user?.role === 'owner', // Lógica simplificada
  }));

  return {
    permissions: results,
    hasAllPermissions: results.every(p => p.hasPermission),
    hasSomePermissions: results.some(p => p.hasPermission),
    isLoading: false,
  };
}