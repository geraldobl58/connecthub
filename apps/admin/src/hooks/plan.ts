"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PlanInfo,
  PlanUpgradeRequest,
  PlanRenewalRequest,
  planHttpService,
} from "../http/plan";

export const usePlan = () => {
  const queryClient = useQueryClient();

  // Query para buscar o plano atual
  const {
    data: currentPlan,
    isLoading: isLoadingPlan,
    error: planError,
  } = useQuery<PlanInfo>({
    queryKey: ["currentPlan"],
    queryFn: async () => {
      return await planHttpService.getCurrentPlan();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Query para buscar histórico de planos
  const {
    data: planHistory,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery<PlanInfo[]>({
    queryKey: ["planHistory"],
    queryFn: async () => {
      return await planHttpService.getPlanHistory();
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para fazer upgrade do plano
  const upgradeMutation = useMutation({
    mutationFn: async (request: PlanUpgradeRequest) => {
      const result = await planHttpService.upgradePlan(request);
      return result.newPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
      queryClient.invalidateQueries({ queryKey: ["planHistory"] });
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Atualizar dados do usuário
    },
  });

  // Mutation para renovar plano
  const renewMutation = useMutation({
    mutationFn: async (request: PlanRenewalRequest) => {
      const result = await planHttpService.renewPlan(request);
      return result.plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
      queryClient.invalidateQueries({ queryKey: ["planHistory"] });
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Atualizar dados do usuário
    },
  });

  // Mutation para cancelar plano
  const cancelMutation = useMutation({
    mutationFn: async () => {
      return await planHttpService.cancelPlan();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
      queryClient.invalidateQueries({ queryKey: ["planHistory"] });
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Atualizar dados do usuário
    },
  });

  return {
    // Data
    currentPlan,
    planHistory,

    // Loading states
    isLoading: isLoadingPlan,
    isLoadingHistory,
    isLoadingUpgrade: upgradeMutation.isPending,
    isLoadingRenew: renewMutation.isPending,
    isLoadingCancel: cancelMutation.isPending,

    // Actions
    upgradePlan: upgradeMutation.mutate,
    renewPlan: renewMutation.mutate,
    cancelPlan: cancelMutation.mutate,

    // Errors
    planError: planError?.message,
    historyError: historyError?.message,
    upgradeError: upgradeMutation.error?.message,
    renewError: renewMutation.error?.message,
    cancelError: cancelMutation.error?.message,

    // Success states
    isUpgradeSuccess: upgradeMutation.isSuccess,
    isRenewSuccess: renewMutation.isSuccess,
    isCancelSuccess: cancelMutation.isSuccess,
  };
};

// Hook específico para upgrade de plano
export const useUpgradePlan = () => {
  const { upgradePlan, isLoadingUpgrade, upgradeError, isUpgradeSuccess } =
    usePlan();

  return {
    upgradePlan,
    isLoading: isLoadingUpgrade,
    error: upgradeError,
    isSuccess: isUpgradeSuccess,
  };
};

// Hook específico para renovação de plano
export const useRenewPlan = () => {
  const { renewPlan, isLoadingRenew, renewError, isRenewSuccess } = usePlan();

  return {
    renewPlan,
    isLoading: isLoadingRenew,
    error: renewError,
    isSuccess: isRenewSuccess,
  };
};
