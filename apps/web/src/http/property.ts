import api from "@/lib/api";
import {
  Property,
  PropertyFilters,
  PropertyListResponse,
  CreatePropertyData,
  UpdatePropertyData,
} from "@/types/property";

export const propertyHttpService = {
  async getAll(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append("q", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/properties/search?${queryString}`
      : "/properties";

    const response = await api.get(url);
    return response.data;
  },

  async getById(id: string): Promise<Property> {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async create(data: CreatePropertyData): Promise<Property> {
    const response = await api.post("/properties", data);
    return response.data;
  },

  async update(id: string, data: UpdatePropertyData): Promise<Property> {
    const response = await api.patch(`/properties/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  },
};
