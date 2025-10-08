import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { propertyHttpService } from "@/http/property";
import {
  PropertyListParams,
  CreatePropertyRequest,
  UpdatePropertyRequest,
} from "@/types/properties";
import { queryKeys } from "@/lib/query-keys";

// Função utilitária para tratar erros da API
function handleApiError(error: unknown, defaultMessage: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
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
 * Hook para listar properties com paginação e filtros
 */
export function useProperties(params: PropertyListParams = {}) {
  return useQuery({
    queryKey: queryKeys.propertiesList(params),
    queryFn: () => propertyHttpService.getProperties(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook para buscar property por ID
 */
export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.propertyById(id),
    queryFn: () => propertyHttpService.getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook para criar property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) =>
      propertyHttpService.createProperty(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
      queryClient.invalidateQueries({ queryKey: queryKeys.propertiesList() });
      toast.success("Propriedade criada com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Erro ao criar propriedade");
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para atualizar property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyRequest }) =>
      propertyHttpService.updateProperty(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
      queryClient.invalidateQueries({ queryKey: queryKeys.propertiesList() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.propertyById(data.id),
      });
      toast.success("Propriedade atualizada com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(
        error,
        "Erro ao atualizar propriedade"
      );
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para deletar property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyHttpService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties });
      queryClient.invalidateQueries({ queryKey: queryKeys.propertiesList() });
      toast.success("Propriedade deletada com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Erro ao deletar propriedade");
      toast.error(errorMessage);
    },
  });
}
