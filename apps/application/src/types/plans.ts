// Plan Types
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

export interface PlanUsage {
  currentUsers: number;
  currentProperties: number;
  currentContacts: number;
  maxUsers: number;
  maxProperties: number;
  maxContacts: number;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Company Types
export interface CompanyInfo {
  id: string;
  name: string;
  tenantId: string;
  domain: string;
  logo?: string;
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Combined Dashboard Data
export interface DashboardData {
  plan: PlanInfo;
  usage: PlanUsage;
  user: UserProfile;
  company: CompanyInfo;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Plan subscription info
export interface SubscriptionInfo {
  id: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  lastPayment?: {
    amount: number;
    currency: string;
    status: string;
    paidAt: string;
  };
}

// Plan history
export interface PlanHistory {
  id: string;
  action: "created" | "upgraded" | "downgraded" | "renewed" | "cancelled";
  fromPlan?: string;
  toPlan?: string;
  amount?: number;
  currency?: string;
  createdAt: string;
  description: string;
}
