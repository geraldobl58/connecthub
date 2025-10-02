"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { cookieUtils } from "@/lib/cookies";
import { isAuthError } from "@/lib/error-utils";
import { useApiQuery } from "./use-api-query";
import { queryKeys } from "@/lib/query-keys";

import { loginAction, getProfileAction } from "../actions/auth";
import { LoginValues } from "../schemas/auth";
import { SignupValues } from "../schemas/signup";
import { signupAction } from "../actions/signup";
import { authHttpService } from "@/http/auth";
import { User } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: profileError,
  } = useApiQuery<User>(
    queryKeys.user,
    async () => await authHttpService.getProfile()
  );

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginValues) => {
      const result = await loginAction(credentials);
      if (!result.success) {
        throw new Error(result.error || "Erro no login");
      }
      return result.data!;
    },
    onSuccess: (data) => {
      // Salvar token manualmente (Server Actions não passam pelo interceptor)
      if (data.access_token) {
        cookieUtils.setToken(data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
    isLoadingProfile: profileMutation.isPending,
    isLoadingSignup: signupMutation.isPending,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    refreshProfile: profileMutation.mutate,
    logout,
    loginError: loginMutation.error?.message,
    signupError: signupMutation.error?.message,
    profileError: profileError?.message || profileMutation.error?.message,
    hasPermission,
    belongsToTenant,
    isLoginSuccess: loginMutation.isSuccess,
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

export const useSignup = () => {
  const { signup, isLoadingSignup, signupError, isSignupSuccess } = useAuth();
  return {
    signup,
    isLoading: isLoadingSignup,
    error: signupError,
    isSuccess: isSignupSuccess,
  };
};
