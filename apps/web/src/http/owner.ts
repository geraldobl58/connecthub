import api from "@/lib/api";
import {
  OwnerResponse,
  OwnerPaginatedResponse,
  CreateOwnerRequest,
  UpdateOwnerRequest,
  OwnerListParams,
} from "@/types/owners";

export const ownerHttpService = {
  /**
   * Listagem de Owners com paginação e filtros
   */
  async getOwners(params?: OwnerListParams): Promise<OwnerPaginatedResponse> {
    // Criar parâmetros limpos para evitar problemas de serialização
    const cleanParams: Record<string, string> = {};

    if (params?.search) {
      cleanParams.search = params.search;
    }
    if (params?.page) {
      cleanParams.page = params.page.toString();
    }
    if (params?.limit) {
      cleanParams.limit = params.limit.toString();
    }

    const response = await api.get("/owners", { params: cleanParams });
    return response.data;
  },

  /**
   * Buscar owner por ID
   */
  async getOwnerById(id: string): Promise<OwnerResponse> {
    const response = await api.get(`/owners/${id}`);
    return response.data;
  },

  /**
   * Criar novo owner
   */
  async createOwner(ownerData: CreateOwnerRequest): Promise<OwnerResponse> {
    const response = await api.post("/owners", ownerData);
    return response.data;
  },

  /**
   * Atualizar owner
   */
  async updateOwner(
    id: string,
    ownerData: UpdateOwnerRequest
  ): Promise<OwnerResponse> {
    const response = await api.patch(`/owners/${id}`, ownerData);
    return response.data;
  },

  /**
   * Deletar owner
   */
  async deleteOwner(id: string): Promise<void> {
    await api.delete(`/owners/${id}`);
  },
};
