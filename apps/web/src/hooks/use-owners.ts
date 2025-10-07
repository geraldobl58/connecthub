import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ownerHttpService } from "@/http/owner";
import {
  OwnerListParams,
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from "@/types/owners";
import { queryKeys } from "@/lib/query-keys";

// Função utilitária para tratar erros da API
function handleApiError(error: unknown, defaultMessage: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as any;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    } else if (axiosError.message) {
      return axiosError.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}

/**
 * Hook para listar owners com paginação e filtros
 */
export function useOwners(params: OwnerListParams = {}) {
  return useQuery({
    queryKey: queryKeys.ownersList(params),
    queryFn: () => ownerHttpService.getOwners(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook para buscar owner por ID
 */
export function useOwner(id: string) {
  return useQuery({
    queryKey: queryKeys.ownerById(id),
    queryFn: () => ownerHttpService.getOwnerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook para criar owner
 */
export function useCreateOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ownerData: CreateOwnerRequest) =>
      ownerHttpService.createOwner(ownerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners });
      queryClient.invalidateQueries({ queryKey: queryKeys.ownersList() });
      toast.success("Proprietário criado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Erro ao criar proprietário");
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para atualizar owner
 */
export function useUpdateOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOwnerRequest }) =>
      ownerHttpService.updateOwner(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners });
      queryClient.invalidateQueries({ queryKey: queryKeys.ownersList() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerById(data.id) });
      toast.success("Proprietário atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(
        error,
        "Erro ao atualizar proprietário"
      );
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para deletar owner
 */
export function useDeleteOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ownerHttpService.deleteOwner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.owners });
      queryClient.invalidateQueries({ queryKey: queryKeys.ownersList() });
      toast.success("Proprietário deletado com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(
        error,
        "Erro ao deletar proprietário"
      );
      toast.error(errorMessage);
    },
  });
}
