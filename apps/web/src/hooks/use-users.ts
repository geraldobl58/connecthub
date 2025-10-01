"use client";

import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/types/users";
import { cookieUtils } from "@/lib/cookies";
import { userHttpService } from "@/http/user";
import { isAuthError } from "@/lib/error-utils";

export const useUsers = () => {
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery<UserResponse[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const userData = await userHttpService.getUsers();

        return userData.data;
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
    users,
    isLoading: isLoadingUsers,
    error: usersError,
  };
};
