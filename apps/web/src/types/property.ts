export interface Property {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description?: string;
  type: PropertyType;
  status: PropertyStatus;
  price?: number;
  bedroom?: number;
  bathroom?: number;
  parking?: number;
  area?: number;
  address?: PropertyAddress;
  features?: Record<string, unknown>;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PropertyAddress {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  CONDO = "CONDO",
  LAND = "LAND",
  COMMERCIAL = "COMMERCIAL",
}

export enum PropertyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  RENTED = "RENTED",
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  page?: number;
  limit?: number;
}

export interface PropertyListResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePropertyData {
  code: string;
  title: string;
  description?: string;
  type: PropertyType;
  status?: PropertyStatus;
  price?: number;
  bedroom?: number;
  bathroom?: number;
  parking?: number;
  area?: number;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  features?: Record<string, unknown>;
  ownerId?: string;
}

export type UpdatePropertyData = Partial<CreatePropertyData>;
