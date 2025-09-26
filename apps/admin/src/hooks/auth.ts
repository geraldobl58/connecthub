"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { cookieUtils } from "@/lib/cookies";

import { loginAction, registerAction, getProfileAction } from "../actions/auth";
import { LoginValues, RegisterValues } from "../schemas/auth";
import { SignupValues } from "../schemas/signup";
import { signupAction } from "../actions/signup";
import { authService, User } from "@/services/auth.service";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: profileError,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const userData = await authService.getProfile();
        return userData;
      } catch (error) {
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

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterValues) => {
      const result = await registerAction(userData);
      if (!result.success) {
        throw new Error(result.error || "Erro no registro");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      // Usuário registrado com sucesso
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (signupData: SignupValues) => {
      const result = await signupAction(signupData);
      if (!result.success) {
        throw new Error(result.error || "Erro no signup");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      router.push(
        `/signup/success?company=${encodeURIComponent(data.tenant.name)}&domain=${data.tenant.slug}&message=${encodeURIComponent(data.message)}`
      );
    },
  });

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

  const logout = () => {
    cookieUtils.removeToken();
    queryClient.clear();
    router.push("/login");
  };

  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false;

    const roleHierarchy = {
      ADMIN: 4,
      MANAGER: 3,
      AGENT: 2,
      VIEWER: 1,
    };

    const userRole =
      roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const required =
      roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userRole >= required;
  };

  const belongsToTenant = (tenantId: string): boolean => {
    return user?.tenantId === tenantId;
  };

  return {
    user,
    isAuthenticated: !!user,
    tenant: user?.tenant,
    isLoading: isLoadingUser || loginMutation.isPending,
    isLoadingLogin: loginMutation.isPending,
    isLoadingRegister: registerMutation.isPending,
    isLoadingProfile: profileMutation.isPending,
    isLoadingSignup: signupMutation.isPending,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    signup: signupMutation.mutate,
    refreshProfile: profileMutation.mutate,
    logout,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
    signupError: signupMutation.error?.message,
    profileError: profileError?.message || profileMutation.error?.message,
    hasPermission,
    belongsToTenant,
    isLoginSuccess: loginMutation.isSuccess,
    isRegisterSuccess: registerMutation.isSuccess,
    isSignupSuccess: signupMutation.isSuccess,
  };
};

// Hooks específicos para compatibilidade com componentes existentes
export const useLogin = () => {
  const { login, isLoadingLogin, loginError, isLoginSuccess } = useAuth();
  return {
    login,
    isLoading: isLoadingLogin,
    error: loginError,
    isSuccess: isLoginSuccess,
  };
};

export const useRegister = () => {
  const { register, isLoadingRegister, registerError, isRegisterSuccess } =
    useAuth();
  return {
    register,
    isLoading: isLoadingRegister,
    error: registerError,
    isSuccess: isRegisterSuccess,
  };
};

export const useSignup = () => {
  const { signup, isLoadingSignup, signupError, isSignupSuccess } = useAuth();
  return {
    signup,
    isLoading: isLoadingSignup,
    error: signupError,
    isSuccess: isSignupSuccess,
  };
};
