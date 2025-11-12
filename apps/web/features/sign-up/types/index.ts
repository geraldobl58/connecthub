export interface SignUpRequest {
  companyName: string;
  contactName: string;
  contactEmail: string;
  domain: string;
  plan: "TRIAL" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  tenantId?: string;
  checkoutUrl?: string;
  token?: string;
  isTrial?: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
}
