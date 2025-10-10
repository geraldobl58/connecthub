import api from "../config/api";
import type {
  PlanInfo,
  UserProfile,
  CompanyInfo,
  PlanUsage,
  SubscriptionInfo,
  PlanHistory,
  ApiResponse,
} from "../types/plans";

// Plans Service
export const plansService = {
  // Get current plan for authenticated user
  async getCurrentPlan(): Promise<PlanInfo> {
    const response = await api.get<PlanInfo>("/plans/current");
    return response.data;
  },

  // Get all available plans
  async getAvailablePlans(): Promise<PlanInfo[]> {
    const response = await api.get<PlanInfo[]>("/plans/available");
    return response.data;
  },

  // Get plan usage statistics
  async getPlanUsage(): Promise<PlanUsage> {
    const response = await api.get<PlanUsage>("/plans/usage");
    return response.data;
  },

  // Get subscription information
  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    const response = await api.get<SubscriptionInfo>("/plans/subscription");
    return response.data;
  },

  // Get plan change history
  async getPlanHistory(): Promise<PlanHistory[]> {
    const response = await api.get<PlanHistory[]>("/plans/history");
    return response.data;
  },

  // Upgrade plan
  async upgradePlan(
    planId: string
  ): Promise<ApiResponse<{ checkoutUrl: string }>> {
    const response = await api.post<ApiResponse<{ checkoutUrl: string }>>(
      "/plans/upgrade",
      {
        planId,
      }
    );
    return response.data;
  },

  // Cancel plan
  async cancelPlan(): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>("/plans/cancel");
    return response.data;
  },
};

// Users Service
export const usersService = {
  // Get current user profile
  async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/users/me");
    return response.data;
  },

  // Update user profile
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/users/me", data);
    return response.data;
  },

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await api.post("/users/me/change-password", data);
  },
};

// Companies Service
export const companiesService = {
  // Get current company information
  async getCurrentCompany(): Promise<CompanyInfo> {
    const response = await api.get<CompanyInfo>("/plans/company");
    return response.data;
  },

  // Update company information
  async updateCompany(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const response = await api.patch<CompanyInfo>("/plans/company", data);
    return response.data;
  },

  // Upload company logo
  async uploadLogo(file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await api.post<{ logoUrl: string }>(
      "/plans/company/logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
