"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { cookieUtils } from "@/lib/cookies";

import { loginAction, registerAction, getProfileAction } from "../actions/auth";
import { LoginValues, RegisterValues } from "../schemas/auth";
import { authService, User } from "@/services/auth.service";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query para buscar o perfil do usuário
  const {
    data: user,
    isLoading: isLoadingUser,
    error: profileError
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const userData = await authService.getProfile();
        return userData;
      } catch (error) {
        // Se erro 401, remover token
        if (authService.isAuthError(error)) {
          cookieUtils.removeToken();
        }
        throw error;
      }
    },
    enabled: cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para fazer login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginValues) => {
      const result = await loginAction(credentials);
      if (!result.success) {
        throw new Error(result.error || "Erro no login");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      cookieUtils.setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Mutation para fazer registro
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterValues) => {
      const result = await registerAction(userData);
      if (!result.success) {
        throw new Error(result.error || "Erro no registro");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      console.log("Usuário registrado:", data);
    },
  });

  // Mutation para buscar perfil manualmente
  const profileMutation = useMutation({
    mutationFn: async () => {
      const result = await getProfileAction();
      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar perfil");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  // Função para fazer logout
  const logout = () => {
    cookieUtils.removeToken();
    queryClient.clear();
    router.push("/login");
  };

  // Função para verificar se usuário tem permissão
  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false;

    const roleHierarchy = {
      ADMIN: 4,
      MANAGER: 3,
      AGENT: 2,
      VIEWER: 1,
    };

    const userRole = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const required = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userRole >= required;
  };

  // Função para verificar se usuário pertence ao tenant
  const belongsToTenant = (tenantId: string): boolean => {
    return user?.tenantId === tenantId;
  };

  return {
    // User data
    user,
    isAuthenticated: !!user,
    tenant: user?.tenant,

    // Loading states
    isLoading: isLoadingUser || loginMutation.isPending,
    isLoadingLogin: loginMutation.isPending,
    isLoadingRegister: registerMutation.isPending,
    isLoadingProfile: profileMutation.isPending,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    refreshProfile: profileMutation.mutate,
    logout,

    // Errors
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
    profileError: profileError?.message || profileMutation.error?.message,

    // Utilities
    hasPermission,
    belongsToTenant,

    // Success states
    isLoginSuccess: loginMutation.isSuccess,
    isRegisterSuccess: registerMutation.isSuccess,
  };
};

// Hook específico para login
export const useLogin = () => {
  const { login, isLoadingLogin, loginError, isLoginSuccess } = useAuth();

  return {
    login,
    isLoading: isLoadingLogin,
    error: loginError,
    isSuccess: isLoginSuccess,
  };
};

// Hook específico para registro
export const useRegister = () => {
  const { register, isLoadingRegister, registerError, isRegisterSuccess } = useAuth();

  return {
    register,
    isLoading: isLoadingRegister,
    error: registerError,
    isSuccess: isRegisterSuccess,
  };
};
