import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientsQueryParams, UpdateClient } from "../types/client";
import {
  getClientsAction,
  getAllClientsAction,
  getClientByIdAction,
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from "../actions/client";

const CLIENTS_QUERY_KEY = ["clients"];
const CLIENT_DETAIL_QUERY_KEY = (id: string) => ["client", id];

/**
 * Hook para listar clientes com paginação e busca
 */
export function useClients(initialParams?: ClientsQueryParams) {
  const [queryParams, setQueryParams] = useState<ClientsQueryParams>(
    initialParams || { page: 1, limit: 10 }
  );

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, queryParams],
    queryFn: async () => {
      const result = await getClientsAction(queryParams);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const handlePageChange = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setQueryParams((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  return {
    data: data,
    clients: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 20,
    pageSize: data?.pageSize || 0,
    hasNextPage: data?.hasNextPage || false,
    hasPrevPage: data?.hasPrevPage || false,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    queryParams, // Expor os parâmetros de busca atuais
  };
}

/**
 * Hook para listar TODOS os clientes (sem paginação) - útil para selects
 */
export function useAllClients() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...CLIENTS_QUERY_KEY, "all"],
    queryFn: async () => {
      const result = await getAllClientsAction();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 0, // Sem cache - sempre buscar dados frescos
    refetchOnMount: true, // Sempre refetch ao montar
  });

  return {
    clients: data || [],
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook para obter cliente por ID
 */
export function useClient(id?: string) {
  const { data, isLoading, isError, error, refetch } = useQuery(
    id
      ? {
          queryKey: CLIENT_DETAIL_QUERY_KEY(id),
          queryFn: async () => {
            const result = await getClientByIdAction(id);
            if (!result.success) throw new Error(result.message);
            return result.data;
          },
          staleTime: 5 * 60 * 1000,
        }
      : {
          queryKey: ["client", "empty"],
          queryFn: async () => undefined,
          enabled: false,
        }
  );

  return {
    client: data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook para criar cliente
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createClientAction,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidar lista de clientes para refetch
        queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}

/**
 * Hook para atualizar cliente
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClient }) =>
      updateClientAction(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidar cliente específico e lista
        queryClient.invalidateQueries({
          queryKey: CLIENT_DETAIL_QUERY_KEY(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}

/**
 * Hook para deletar cliente
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteClientAction,
    onSuccess: (response, id) => {
      if (response.success) {
        // Invalidar cliente específico e lista
        queryClient.invalidateQueries({
          queryKey: CLIENT_DETAIL_QUERY_KEY(id),
        });
        queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}
