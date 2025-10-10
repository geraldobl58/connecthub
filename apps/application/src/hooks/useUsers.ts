import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../http/users";
import type {
  UserQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/users";

// Query keys para melhor gerenciamento de cache
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserQueryParams) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, "current"] as const,
};

// Hook para listar usuários com filtros e paginação
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => usersService.getUsers(params),
    staleTime: 0, // Sempre considerar dados como stale
    gcTime: 1000 * 60 * 5, // Manter em cache por 5 minutos (antigo cacheTime)
    retry: 2,
    refetchOnMount: true, // Sempre refetch ao montar
  });
}

// Hook para buscar usuário por ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
}

// Hook para buscar usuário atual
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: usersService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
}

// Mutation hooks
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.createUser(data),
    onSuccess: (newUser) => {
      // Invalidar todas as listas para refletir o novo usuário
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Adicionar o novo usuário ao cache de detalhes
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersService.updateUser(id, data),
    onSuccess: (updatedUser, variables) => {
      // Atualizar o cache de detalhes
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);

      // Invalidar listas para refletir as mudanças
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao atualizar usuário:", error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remover do cache de detalhes
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });

      // Invalidar listas para refletir a remoção
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao excluir usuário:", error);
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersService.toggleUserStatus(id, isActive),
    onSuccess: (updatedUser, variables) => {
      // Atualizar o cache de detalhes
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);

      // Invalidar listas para refletir as mudanças
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao alterar status do usuário:", error);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Atualizar cache do usuário atual
      queryClient.setQueryData(userKeys.current(), updatedUser);

      // Se o usuário está sendo visualizado em detalhes, atualizar também
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      // Invalidar listas caso o usuário apareça nelas
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Erro ao atualizar perfil:", error);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      usersService.changePassword(data),
    onError: (error) => {
      console.error("Erro ao alterar senha:", error);
    },
  });
}

// Hook utilitário para invalidar todos os dados de usuários
export function useInvalidateUsers() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
  };
}
