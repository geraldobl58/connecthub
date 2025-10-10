import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plansService, usersService, companiesService } from "../http/plans";

// Query keys for better cache management
export const planKeys = {
  all: ["plans"] as const,
  current: () => [...planKeys.all, "current"] as const,
  available: () => [...planKeys.all, "available"] as const,
  usage: () => [...planKeys.all, "usage"] as const,
  subscription: () => [...planKeys.all, "subscription"] as const,
  history: () => [...planKeys.all, "history"] as const,
};

export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "current"] as const,
};

export const companyKeys = {
  all: ["companies"] as const,
  current: () => [...companyKeys.all, "current"] as const,
};

// Plan hooks
export function useCurrentPlan() {
  return useQuery({
    queryKey: planKeys.current(),
    queryFn: plansService.getCurrentPlan,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useAvailablePlans() {
  return useQuery({
    queryKey: planKeys.available(),
    queryFn: plansService.getAvailablePlans,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

export function usePlanUsage() {
  return useQuery({
    queryKey: planKeys.usage(),
    queryFn: plansService.getPlanUsage,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });
}

export function useSubscriptionInfo() {
  return useQuery({
    queryKey: planKeys.subscription(),
    queryFn: plansService.getSubscriptionInfo,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function usePlanHistory() {
  return useQuery({
    queryKey: planKeys.history(),
    queryFn: plansService.getPlanHistory,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

// User hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: usersService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Company hooks
export function useCurrentCompany() {
  return useQuery({
    queryKey: companyKeys.current(),
    queryFn: companiesService.getCurrentCompany,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Combined hook for dashboard data
export function useDashboardData() {
  const planQuery = useCurrentPlan();
  const usageQuery = usePlanUsage();
  const userQuery = useCurrentUser();
  const companyQuery = useCurrentCompany();

  return {
    plan: planQuery,
    usage: usageQuery,
    user: userQuery,
    company: companyQuery,
    isLoading:
      planQuery.isLoading ||
      usageQuery.isLoading ||
      userQuery.isLoading ||
      companyQuery.isLoading,
    isError:
      planQuery.isError ||
      usageQuery.isError ||
      userQuery.isError ||
      companyQuery.isError,
    error:
      planQuery.error ||
      usageQuery.error ||
      userQuery.error ||
      companyQuery.error,
    refetch: () => {
      planQuery.refetch();
      usageQuery.refetch();
      userQuery.refetch();
      companyQuery.refetch();
    },
  };
}

// Mutation hooks
export function useUpgradePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansService.upgradePlan,
    onSuccess: () => {
      // Invalidate plan-related queries
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useCancelPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plansService.cancelPlan,
    onSuccess: () => {
      // Invalidate plan-related queries
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData(userKeys.current(), data);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: usersService.changePassword,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesService.updateCompany,
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData(companyKeys.current(), data);
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesService.uploadLogo,
    onSuccess: () => {
      // Refetch company data to get updated logo
      queryClient.invalidateQueries({ queryKey: companyKeys.current() });
    },
  });
}
