import React, { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  AuthContextType,
  AuthRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from "../types/auth";
import {
  authService,
  setStoredToken,
  removeStoredToken,
  getStoredToken,
} from "../http/auth";
import { useProfile } from "../hooks/useAuth";
import { authKeys } from "../hooks/useAuth";

import { AuthContext } from "../context/authContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const profileQuery = useProfile();
  const user = profileQuery.data || null;

  const login = useCallback(
    async (credentials: AuthRequest) => {
      const data = await authService.login(credentials);
      // persist token and set axios header
      setStoredToken(data.access_token);
      // update profile cache
      queryClient.setQueryData(authKeys.profile(), data.user as User);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    [queryClient]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const resp = await authService.register(data);
      setStoredToken(resp.access_token);
      queryClient.setQueryData(authKeys.profile(), resp.user as User);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore server logout errors
      console.warn("logout error", err);
    } finally {
      removeStoredToken();
      queryClient.clear();
    }
  }, [queryClient]);

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      const updated = await authService.updateProfile(data);
      queryClient.setQueryData(authKeys.profile(), updated as User);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // AuthContextType expects Promise<void>
      return Promise.resolve();
    },
    [queryClient]
  );

  const token = getStoredToken();

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading: profileQuery.isLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [
      user,
      token,
      profileQuery.isLoading,
      login,
      register,
      logout,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// only export the provider from this file; hook is in context/authContext.ts
export default AuthProvider;
