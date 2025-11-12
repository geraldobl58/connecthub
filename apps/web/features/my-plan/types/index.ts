export interface PlanCurrentInfoApiResponse {
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    maxUsers: number;
    maxContacts: number;
    hasAPI: boolean;
    description: string;
    planExpiresAt: string;
    createdAt: string;
    status: string;
  };
  company: {
    id: string;
    name: string;
    tenantId: string;
    domain: string;
    createdAt: string;
    updatedAt: string;
  };
  usage: {
    currentUsers: number;
    maxUsers: number;
  };
  limits: {
    contacts: {
      limit: number;
    };
    api: {
      enabled: boolean;
    };
  };
}

export interface PlanCurrentInfoResponse {
  success: boolean;
  message?: string;
  data?: {
    plan: {
      id: string;
      name: string;
      price: number;
      currency: string;
      maxUsers: number;
      maxContacts: number;
      hasAPI: boolean;
      description: string;
      planExpiresAt: string;
      createdAt: string;
      status: string;
    };
    company: {
      id: string;
      name: string;
      tenantId: string;
      domain: string;
      createdAt: string;
      updatedAt: string;
    };
    usage: {
      currentUsers: number;
      maxUsers: number;
    };
    limits: {
      contacts: {
        limit: number;
      };
      api: {
        enabled: boolean;
      };
    };
  };
}

// Plan Types
export enum PlanType {
  STARTER = "STARTER",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}

// Current Plan Type
export interface CurrentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  maxUsers: number;
  maxContacts: number;
  hasAPI: boolean;
  description: string;
  planExpiresAt: string;
  createdAt: string;
  status: string;
}

// Available Plan Type
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

// Upgrade types
export interface PlanUpgradeDto {
  stripePriceId: string; // Obrigatório para upgrade de assinatura ativa
}

export interface PlanUpgradeResponse {
  success: boolean;
  message: string;
  newPlan: {
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
  };
  nextBillingDate: string;
}
