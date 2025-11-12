import { api } from "@/lib/api-client";
import {
  PlanCurrentInfoApiResponse,
  PlanCurrentInfoResponse,
  PlanUpgradeDto,
  PlanUpgradeResponse,
} from "../types";

export interface AvailablePlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  priceId: string;
  maxUsers?: number;
  maxContacts?: number;
  hasAPI: boolean;
  description: string;
}

export interface CancelResponse {
  success: boolean;
  message: string;
}

export interface SubscriptionHistoryEvent {
  id: string;
  action: string;
  previousPlanName?: string;
  previousPlanPrice?: number;
  newPlanName?: string;
  newPlanPrice?: number;
  reason?: string;
  notes?: string;
  triggeredBy?: string;
  createdAt: string;
}

export interface PlanHistorySummary {
  totalUpgrades: number;
  totalDowngrades: number;
  totalCancellations: number;
  daysSinceCreation: number;
  daysUntilExpiry?: number;
}

export interface PlanHistoryResponse {
  currentStatus: "ACTIVE" | "CANCELED" | "EXPIRED";
  currentPlan: string;
  currentPlanPrice: number;
  currentExpiresAt: string;
  startedAt: string;
  events: SubscriptionHistoryEvent[];
  summary: PlanHistorySummary;
}

export interface PlanHistoryDetailEvent {
  id: string;
  timestamp: string;
  action: string;
  previousPlan: string | null;
  currentPlan: string | null;
  description: string;
  reason?: string;
  triggeredBy?: string;
}

export interface PlanHistory {
  id: string;
  name: string;
  price: number;
  currency: string;
  maxUsers?: number;
  maxContacts?: number;
  hasAPI: boolean;
  description: string;
  planExpiresAt: string;
  createdAt: string;
  status: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface BillingPortalResponse {
  url: string;
}

export interface ValidationResponse {
  isValid: boolean;
}

export async function getCurrentPlan(): Promise<PlanCurrentInfoResponse> {
  const response = await api
    .get("plans/info")
    .json<PlanCurrentInfoApiResponse>();

  return {
    success: true,
    message: "Current plan retrieved successfully",
    data: {
      plan: {
        id: response.plan.id,
        name: response.plan.name,
        price: response.plan.price,
        currency: response.plan.currency,
        maxUsers: response.plan.maxUsers,
        maxContacts: response.plan.maxContacts,
        hasAPI: response.plan.hasAPI,
        description: response.plan.description,
        planExpiresAt: response.plan.planExpiresAt,
        createdAt: response.plan.createdAt,
        status: response.plan.status,
      },
      company: {
        id: response.company.id,
        name: response.company.name,
        tenantId: response.company.tenantId,
        domain: response.company.domain,
        createdAt: response.company.createdAt,
        updatedAt: response.company.updatedAt,
      },
      usage: {
        currentUsers: response.usage.currentUsers,
        maxUsers: response.usage.maxUsers,
      },
      limits: {
        contacts: {
          limit: response.limits.contacts.limit,
        },
        api: {
          enabled: response.limits.api.enabled,
        },
      },
    },
  };
}

interface PlanApiResponse {
  id: string;
  name: string;
  price: number;
  currency: string;
  stripePriceId?: string;
  stripeProductId?: string;
  maxUsers?: number;
  maxContacts?: number;
  hasAPI: boolean;
  description?: string;
}

export async function getAvailablePlans(): Promise<AvailablePlan[]> {
  const response = await api.get("plans/available").json<PlanApiResponse[]>();

  // Mapear stripePriceId para priceId
  return response.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    currency: plan.currency,
    priceId: plan.stripePriceId || "", // ← Renomear stripePriceId para priceId
    maxUsers: plan.maxUsers,
    maxContacts: plan.maxContacts,
    hasAPI: plan.hasAPI,
    description: plan.description || "",
  }));
}

export async function upgradePlan(
  dto: PlanUpgradeDto
): Promise<PlanUpgradeResponse> {
  const response = await api
    .post("plans/upgrade", { json: dto })
    .json<PlanUpgradeResponse>();

  return response;
}

export async function cancelPlan(): Promise<CancelResponse> {
  const response = await api
    .post("plans/cancel", { json: {} })
    .json<CancelResponse>();

  return response;
}

export async function getPlanHistory(): Promise<PlanHistoryResponse> {
  const response = await api.get("plans/history").json<PlanHistoryResponse>();

  return response;
}

export async function getPlanHistoryDetailed(): Promise<
  PlanHistoryDetailEvent[]
> {
  const response = await api
    .get("plans/history/detailed")
    .json<PlanHistoryDetailEvent[]>();

  return response;
}

export async function reactivatePlan(): Promise<CancelResponse> {
  const response = await api
    .post("plans/reactivate", { json: {} })
    .json<CancelResponse>();

  return response;
}

export async function createCheckoutSession(dto: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutSessionResponse> {
  const response = await api
    .post("plans/checkout-session", { json: dto })
    .json<CheckoutSessionResponse>();

  return response;
}

export async function createBillingPortalSession(dto: {
  returnUrl: string;
}): Promise<BillingPortalResponse> {
  const response = await api
    .post("plans/billing-portal", { json: dto })
    .json<BillingPortalResponse>();

  return response;
}

export async function validateSubscription(): Promise<ValidationResponse> {
  const response = await api
    .get("plans/subscription/validate")
    .json<ValidationResponse>();

  return response;
}
