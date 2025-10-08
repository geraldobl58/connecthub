// Response types matching API
export interface PropertyResponse {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description?: string;
  type: "HOUSE" | "APARTMENT" | "CONDO" | "LAND" | "COMMERCIAL";
  status: "ACTIVE" | "INACTIVE" | "RESERVED" | "SOLD" | "RENTED";
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  bedroom?: number;
  bathroom?: number;
  parking?: number;
  area?: number;
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  features?: Record<string, unknown>;
  coverImage?: string;
  galleryImages?: string[];
  leads?: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    source: string;
    stage?: {
      id: string;
      name: string;
    };
  }>;
  deals?: Array<{
    id: string;
    value?: number;
    status: string;
    createdAt: string;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
  }>;
  notes?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author?: {
      id: string;
      name: string;
    };
  }>;
  _count?: {
    leads: number;
    deals: number;
    tasks: number;
    notes: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PropertyMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PropertyPaginatedResponse {
  data: PropertyResponse[];
  meta: PropertyMeta;
}

// Request types for API calls
export interface CreatePropertyRequest {
  code: string;
  title: string;
  description?: string;
  type: "HOUSE" | "APARTMENT" | "CONDO" | "LAND" | "COMMERCIAL";
  status?: "ACTIVE" | "INACTIVE" | "RESERVED" | "SOLD" | "RENTED";
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  bedroom?: number;
  bathroom?: number;
  parking?: number;
  area?: number;
  ownerId?: string;
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  features?: Record<string, unknown>;
  coverImage?: string;
  galleryImages?: string[];
}

export interface UpdatePropertyRequest {
  code?: string;
  title?: string;
  description?: string;
  type?: "HOUSE" | "APARTMENT" | "CONDO" | "LAND" | "COMMERCIAL";
  status?: "ACTIVE" | "INACTIVE" | "RESERVED" | "SOLD" | "RENTED";
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  bedroom?: number;
  bathroom?: number;
  parking?: number;
  area?: number;
  ownerId?: string;
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  features?: Record<string, unknown>;
  coverImage?: string;
  galleryImages?: string[];
}

export interface PropertyListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "HOUSE" | "APARTMENT" | "CONDO" | "LAND" | "COMMERCIAL";
  status?: "ACTIVE" | "INACTIVE" | "RESERVED" | "SOLD" | "RENTED";
  ownerId?: string;
  minPrice?: number;
  maxPrice?: number;
}
