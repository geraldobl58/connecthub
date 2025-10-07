import api from "@/lib/api";
import {
  PropertyResponse,
  PropertyPaginatedResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyListParams,
} from "@/types/properties";

export const propertyHttpService = {
  /**
   * Listagem de Properties com paginação e filtros
   */
  async getProperties(
    params?: PropertyListParams
  ): Promise<PropertyPaginatedResponse> {
    // Criar parâmetros limpos para evitar problemas de serialização
    const cleanParams: Record<string, string> = {};

    if (params?.search) {
      cleanParams.search = params.search;
    }
    if (params?.type) {
      cleanParams.type = params.type;
    }
    if (params?.status) {
      cleanParams.status = params.status;
    }
    if (params?.ownerId) {
      cleanParams.ownerId = params.ownerId;
    }
    if (params?.minPrice !== undefined) {
      cleanParams.minPrice = params.minPrice.toString();
    }
    if (params?.maxPrice !== undefined) {
      cleanParams.maxPrice = params.maxPrice.toString();
    }
    if (params?.page) {
      cleanParams.page = params.page.toString();
    }
    if (params?.limit) {
      cleanParams.limit = params.limit.toString();
    }

    const response = await api.get("/properties", { params: cleanParams });
    return response.data;
  },

  /**
   * Buscar property por ID
   */
  async getPropertyById(id: string): Promise<PropertyResponse> {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  /**
   * Criar nova property
   */
  async createProperty(
    propertyData: CreatePropertyRequest
  ): Promise<PropertyResponse> {
    const response = await api.post("/properties", propertyData);
    return response.data;
  },

  /**
   * Atualizar property
   */
  async updateProperty(
    id: string,
    propertyData: UpdatePropertyRequest
  ): Promise<PropertyResponse> {
    const response = await api.patch(`/properties/${id}`, propertyData);
    return response.data;
  },

  /**
   * Deletar property
   */
  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  },
};
