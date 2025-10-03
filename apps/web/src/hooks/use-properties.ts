"use client";

import { useApiQuery, useApiMutation } from "./use-api-query";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  Property,
  PropertyFilters,
  PropertyListResponse,
  CreatePropertyData,
  UpdatePropertyData,
} from "@/types/property";
import { propertyHttpService } from "@/http/property";

export const useProperties = (filters?: PropertyFilters) => {
  const {
    data: propertiesData,
    isLoading: isLoadingProperties,
    error: propertiesError,
    refetch,
  } = useApiQuery<PropertyListResponse>(
    queryKeys.propertiesList(filters),
    async () => await propertyHttpService.getAll(filters || {})
  );

  return {
    properties: propertiesData?.data || [],
    meta: {
      total: propertiesData?.total || 0,
      page: propertiesData?.page || 1,
      limit: propertiesData?.limit || 10,
      totalPages: propertiesData?.totalPages || 0,
    },
    isLoading: isLoadingProperties,
    error: propertiesError,
    refetch,
  };
};

export const useProperty = (id: string) => {
  const {
    data: property,
    isLoading: isLoadingProperty,
    error: propertyError,
  } = useApiQuery<Property>(
    queryKeys.propertyById(id),
    async () => await propertyHttpService.getById(id),
    {
      enabled: !!id,
    }
  );

  return {
    property,
    isLoading: isLoadingProperty,
    error: propertyError,
  };
};

export const useCreateProperty = () => {
  return useApiMutation<Property, CreatePropertyData>(
    async (data: CreatePropertyData) => {
      try {
        const result = await propertyHttpService.create(data);
        return result;
      } catch (error: unknown) {
        throw error;
      }
    },
    [queryKeys.properties, queryKeys.property]
  );
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useApiMutation<Property, { id: string; data: UpdatePropertyData }>(
    async ({ id, data }) => await propertyHttpService.update(id, data),
    [queryKeys.properties, queryKeys.property],
    {
      onSuccess: (
        _: Property,
        variables: { id: string; data: UpdatePropertyData }
      ) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.propertyById(variables.id),
        });
      },
    }
  );
};

export const useDeleteProperty = () => {
  return useApiMutation<void, string>(
    async (id: string) => await propertyHttpService.delete(id),
    [queryKeys.properties, queryKeys.property]
  );
};
