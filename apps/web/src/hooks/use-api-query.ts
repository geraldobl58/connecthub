"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cookieUtils } from "@/lib/cookies";
import { isAuthError } from "@/lib/error-utils";

/**
 * Hook customizado para queries com padrões comuns de autenticação
 */
export function useApiQuery<TData>(
  queryKey: (string | unknown)[],
  queryFn: () => Promise<TData>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    retry?: boolean;
  }
) {
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        if (isAuthError(error)) {
          cookieUtils.removeToken();
        }
        throw error;
      }
    },
    enabled: options?.enabled ?? cookieUtils.hasToken(),
    retry: options?.retry ?? false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook customizado para mutations com padrões comuns de cache invalidation
 */
export function useApiMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateKeys?: (string | unknown)[][],
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: unknown) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (invalidateKeys) {
        invalidateKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      if (isAuthError(error)) {
        cookieUtils.removeToken();
      }
      options?.onError?.(error);
    },
  });
}
