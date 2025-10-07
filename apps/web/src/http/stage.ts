import api from "@/lib/api";
import {
  StageResponse,
  StagePaginatedResponse,
  CreateStageRequest,
  UpdateStageRequest,
  ReorderStagesRequest,
  CreateStageResponse,
  UpdateStageResponse,
  ReorderStagesResponse,
  StageListParams,
} from "@/types/stages";

export const stageHttpService = {
  /**
   * Listagem de Stages com paginação e filtros
   */
  async getStages(params?: StageListParams): Promise<StagePaginatedResponse> {
    // Criar parâmetros limpos para evitar problemas de serialização
    const cleanParams: Record<string, string> = {};

    if (params?.search) {
      cleanParams.search = params.search;
    }
    if (params?.type) {
      cleanParams.type = params.type;
    }
    if (params?.isWon !== undefined) {
      cleanParams.isWon = params.isWon.toString();
    }
    if (params?.isLost !== undefined) {
      cleanParams.isLost = params.isLost.toString();
    }
    if (params?.page) {
      cleanParams.page = params.page.toString();
    }
    if (params?.limit) {
      cleanParams.limit = params.limit.toString();
    }

    const response = await api.get("/stages", { params: cleanParams });
    return response.data;
  },

  /**
   * Buscar stage por ID
   */
  async getStageById(id: string): Promise<StageResponse> {
    const response = await api.get(`/stages/${id}`);
    return response.data;
  },

  /**
   * Criar novo stage
   */
  async createStage(
    stageData: CreateStageRequest
  ): Promise<CreateStageResponse> {
    const response = await api.post("/stages", stageData);
    return response.data;
  },

  /**
   * Atualizar stage
   */
  async updateStage(
    id: string,
    stageData: UpdateStageRequest
  ): Promise<UpdateStageResponse> {
    const response = await api.patch(`/stages/${id}`, stageData);
    return response.data;
  },

  /**
   * Reordenar stages
   */
  async reorderStages(
    reorderData: ReorderStagesRequest
  ): Promise<ReorderStagesResponse[]> {
    const response = await api.patch("/stages/reorder", reorderData);
    return response.data;
  },

  /**
   * Deletar stage
   */
  async deleteStage(id: string): Promise<void> {
    await api.delete(`/stages/${id}`);
  },
};
