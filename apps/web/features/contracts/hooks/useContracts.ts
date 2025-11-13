import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractsQueryParams, UpdateContract } from "../types/contract";
import {
  getContractsAction,
  getContractByIdAction,
  createContractAction,
  updateContractAction,
  deleteContractAction,
} from "../actions/contract";

const CONTRACTS_QUERY_KEY = ["contracts"];
const CONTRACT_DETAIL_QUERY_KEY = (id: string) => ["contract", id];

/**
 * Hook para listar contratos com paginação
 */
export function useContracts(params?: ContractsQueryParams) {
  const [queryParams, setQueryParams] = useState<ContractsQueryParams>(
    params || { page: 1, limit: 20 }
  );

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...CONTRACTS_QUERY_KEY, queryParams],
    queryFn: async () => {
      const result = await getContractsAction(queryParams);
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
    contracts: data?.data || [],
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
  };
}

/**
 * Hook para obter contrato por ID
 */
export function useContract(id?: string) {
  const { data, isLoading, isError, error, refetch } = useQuery(
    id
      ? {
          queryKey: CONTRACT_DETAIL_QUERY_KEY(id),
          queryFn: async () => {
            const result = await getContractByIdAction(id);
            if (!result.success) throw new Error(result.message);
            return result.data;
          },
          staleTime: 5 * 60 * 1000,
        }
      : {
          queryKey: ["contract", "empty"],
          queryFn: async () => undefined,
          enabled: false,
        }
  );

  return {
    contract: data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook para criar contrato
 */
export function useCreateContract() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createContractAction,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidar lista de contratos para refetch
        queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}

/**
 * Hook para atualizar contrato
 */
export function useUpdateContract() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContract }) =>
      updateContractAction(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidar contrato específico e lista
        queryClient.invalidateQueries({
          queryKey: CONTRACT_DETAIL_QUERY_KEY(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}

/**
 * Hook para deletar contrato
 */
export function useDeleteContract() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteContractAction,
    onSuccess: (response, id) => {
      if (response.success) {
        // Invalidar contrato específico e lista
        queryClient.invalidateQueries({
          queryKey: CONTRACT_DETAIL_QUERY_KEY(id),
        });
        queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}
