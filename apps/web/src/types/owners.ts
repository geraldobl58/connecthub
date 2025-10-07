// Response types matching API
export interface OwnerResponse {
  id: string;
  tenantId: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  properties?: Array<{
    id: string;
    code: string;
    title: string;
    type: string;
    status: string;
    price?: number;
  }>;
  _count?: {
    properties: number;
  };
}

export interface OwnerMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OwnerPaginatedResponse {
  data: OwnerResponse[];
  meta: OwnerMeta;
}

// Request types for API calls
export interface CreateOwnerRequest {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface UpdateOwnerRequest {
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface OwnerListParams {
  page?: number;
  limit?: number;
  search?: string;
}
