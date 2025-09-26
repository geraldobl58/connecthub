import api from "@/lib/api";
import { getErrorMessage } from "@/lib/error-utils";

export interface PlanInfo {
  id: string;
  name: string;
  price: number;
  currency: string;
  maxUsers?: number;
  maxProperties?: number;
  maxContacts?: number;
  hasAPI: boolean;
  description: string;
  planExpiresAt: string;
  createdAt: string;
  status: "ACTIVE" | "EXPIRED" | "TRIAL" | "CANCELLED";
}

export interface PlanUpgradeRequest {
  newPlan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
}

export interface PlanUpgradeResponse {
  success: boolean;
  message: string;
  newPlan: PlanInfo;
  nextBillingDate: string;
}

export interface PlanRenewalRequest {
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  paymentMethod?: string;
}

export interface PlanRenewalResponse {
  success: boolean;
  message: string;
  plan: PlanInfo;
  nextBillingDate: string;
}

export const planHttpService = {
  /**
   * Buscar informações do plano atual do tenant
   */
  async getCurrentPlan(): Promise<PlanInfo> {
    const response = await api.get("/plans/current");
    return response.data;
  },

  /**
   * Fazer upgrade do plano
   */
  async upgradePlan(request: PlanUpgradeRequest): Promise<PlanUpgradeResponse> {
    const response = await api.post("/plans/upgrade", request);
    return response.data;
  },

  /**
   * Renovar plano
   */
  async renewPlan(request: PlanRenewalRequest): Promise<PlanRenewalResponse> {
    const response = await api.post("/plans/renew", request);
    return response.data;
  },

  /**
   * Cancelar plano
   */
  async cancelPlan(): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/plans/cancel");
    return response.data;
  },

  /**
   * Buscar histórico de planos
   */
  async getPlanHistory(): Promise<PlanInfo[]> {
    const response = await api.get("/plans/history");
    return response.data;
  },

  /**
   * Calcular tempo restante do plano
   */
  calculateTimeRemaining(expiresAt: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
  } {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const difference = expiry - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        isExpiringSoon: false,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      isExpiringSoon: days <= 7,
    };
  },

  /**
   * Verificar se o plano está próximo do vencimento
   */
  isExpiringSoon(expiresAt: string, daysThreshold: number = 7): boolean {
    const timeRemaining = this.calculateTimeRemaining(expiresAt);
    return timeRemaining.days <= daysThreshold && !timeRemaining.isExpired;
  },

  /**
   * Verificar se o plano está expirado
   */
  isExpired(expiresAt: string): boolean {
    return this.calculateTimeRemaining(expiresAt).isExpired;
  },

  /**
   * Formatar data de expiração para exibição
   */
  formatExpiryDate(expiresAt: string): string {
    return new Date(expiresAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /**
   * Obter status do plano baseado na data de expiração
   */
  getPlanStatus(expiresAt: string): "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" {
    const timeRemaining = this.calculateTimeRemaining(expiresAt);

    if (timeRemaining.isExpired) return "EXPIRED";
    if (timeRemaining.isExpiringSoon) return "EXPIRING_SOON";
    return "ACTIVE";
  },
};
