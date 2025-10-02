"use client";

import { useApiQuery, useApiMutation } from "./use-api-query";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  UserResponse,
  UserPaginatedResponse,
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/users";
import { userHttpService } from "@/http/user";

export const useUsers = (params?: UserListParams) => {
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch,
  } = useApiQuery<UserPaginatedResponse>(
    queryKeys.usersList(params),
    async () => await userHttpService.getUsers(params)
  );

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
  } = useApiQuery<UserResponse>(
    queryKeys.userById(id),
    async () => await userHttpService.getUserById(id),
    {
      enabled: !!id,
    }
  );

  return {
    user,
    isLoading: isLoadingUser,
    error: userError,
  };
};

export const useCreateUser = () => {
  return useApiMutation<unknown, CreateUserRequest>(
    async (userData: CreateUserRequest) =>
      await userHttpService.createUser(userData),
    [queryKeys.users, queryKeys.user]
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, { id: string; userData: UpdateUserRequest }>(
    async ({ id, userData }) => await userHttpService.updateUser(id, userData),
    [queryKeys.users, queryKeys.user],
    {
      onSuccess: (
        _: unknown,
        variables: { id: string; userData: UpdateUserRequest }
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.userById(variables.id),
        });
      },
    }
  );
};

export const useDeleteUser = () => {
  return useApiMutation<unknown, string>(
    async (id: string) => await userHttpService.deleteUser(id),
    [queryKeys.users, queryKeys.user]
  );
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, { id: string; isActive: boolean }>(
    async ({ id, isActive }) =>
      await userHttpService.toggleUserStatus(id, isActive),
    [queryKeys.users],
    {
      onSuccess: (_: unknown, variables: { id: string; isActive: boolean }) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.userById(variables.id),
        });
      },
    }
  );
};
