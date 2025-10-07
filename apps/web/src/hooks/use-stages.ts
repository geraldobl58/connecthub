"use client";

import { useApiQuery, useApiMutation } from "./use-api-query";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  StageResponse,
  StagePaginatedResponse,
  CreateStageRequest,
  UpdateStageRequest,
  ReorderStagesRequest,
  CreateStageResponse,
  UpdateStageResponse,
  ReorderStagesResponse,
  StageListParams,
} from "@/types/stages";
import { stageHttpService } from "@/http/stage";

export const useStages = (params?: StageListParams) => {
  const {
    data: stagesData,
    isLoading: isLoadingStages,
    error: stagesError,
    refetch,
  } = useApiQuery<StagePaginatedResponse>(
    queryKeys.stagesList(params),
    async () => await stageHttpService.getStages(params)
  );

  return {
    stages: stagesData?.data || [],
    meta: stagesData?.meta,
    isLoading: isLoadingStages,
    error: stagesError,
    refetch,
  };
};

export const useStage = (id: string) => {
  const {
    data: stage,
    isLoading: isLoadingStage,
    error: stageError,
  } = useApiQuery<StageResponse>(
    queryKeys.stageById(id),
    async () => await stageHttpService.getStageById(id),
    {
      enabled: !!id,
    }
  );

  return {
    stage,
    isLoading: isLoadingStage,
    error: stageError,
  };
};

export const useCreateStage = () => {
  return useApiMutation<CreateStageResponse, CreateStageRequest>(
    async (stageData: CreateStageRequest) =>
      await stageHttpService.createStage(stageData),
    [queryKeys.stages]
  );
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();

  return useApiMutation<
    UpdateStageResponse,
    { id: string; stageData: UpdateStageRequest }
  >(
    async ({ id, stageData }) =>
      await stageHttpService.updateStage(id, stageData),
    [queryKeys.stages],
    {
      onSuccess: (
        _: UpdateStageResponse,
        variables: { id: string; stageData: UpdateStageRequest }
      ) => {
        // Invalida tanto o stage específico quanto a lista de stages
        queryClient.invalidateQueries({
          queryKey: queryKeys.stageById(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.stages,
        });
      },
    }
  );
};

export const useReorderStages = () => {
  return useApiMutation<ReorderStagesResponse[], ReorderStagesRequest>(
    async (reorderData: ReorderStagesRequest) =>
      await stageHttpService.reorderStages(reorderData),
    [queryKeys.stages]
  );
};

export const useDeleteStage = () => {
  return useApiMutation<unknown, string>(
    async (id: string) => await stageHttpService.deleteStage(id),
    [queryKeys.stages]
  );
};
