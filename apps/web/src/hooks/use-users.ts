"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserResponse,
  UserPaginatedResponse,
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/users";
import { cookieUtils } from "@/lib/cookies";
import { userHttpService } from "@/http/user";
import { isAuthError } from "@/lib/error-utils";

export const useUsers = (params?: UserListParams) => {
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch,
  } = useQuery<UserPaginatedResponse>({
    queryKey: ["users", params],
    queryFn: async () => {
      try {
        const userData = await userHttpService.getUsers(params);
        return userData;
      } catch (error) {
        if (isAuthError(error)) {
          cookieUtils.removeToken();
        }
        throw error;
      }
    },
    enabled: cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    users: usersData?.data || [],
    meta: usersData?.meta,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch,
  };
};

export const useUser = (id: string) => {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<UserResponse>({
    queryKey: ["user", id],
    queryFn: async () => {
      try {
        const userData = await userHttpService.getUserById(id);
        return userData;
      } catch (error) {
        if (isAuthError(error)) {
          cookieUtils.removeToken();
        }
        throw error;
      }
    },
    enabled: !!id && cookieUtils.hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    user,
    isLoading: isLoadingUser,
    error: userError,
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest) => {
      return await userHttpService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      if (isAuthError(error)) {
        cookieUtils.removeToken();
      }
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserRequest;
    }) => {
      return await userHttpService.updateUser(id, userData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
    onError: (error) => {
      if (isAuthError(error)) {
        cookieUtils.removeToken();
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await userHttpService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      if (isAuthError(error)) {
        cookieUtils.removeToken();
      }
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await userHttpService.toggleUserStatus(id, isActive);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
    onError: (error) => {
      if (isAuthError(error)) {
        cookieUtils.removeToken();
      }
    },
  });
};
