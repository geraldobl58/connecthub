// Response types matching API
export interface StageResponse {
  id: string;
  tenantId: string;
  name: string;
  type: "SALES" | "SUPPORT";
  order: number;
  isWon: boolean;
  isLost: boolean;
  color?: string;
}

export interface StageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StagePaginatedResponse {
  data: StageResponse[];
  meta: StageMeta;
}

// Request types for API calls
export interface CreateStageRequest {
  name: string;
  type?: "SALES" | "SUPPORT";
  color?: string;
}

export interface UpdateStageRequest {
  name?: string;
  type?: "SALES" | "SUPPORT";
  color?: string;
  isWon?: boolean;
  isLost?: boolean;
}

export interface ReorderStagesRequest {
  stageIds: string[];
}

export interface StageListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "SALES" | "SUPPORT";
  isWon?: boolean;
  isLost?: boolean;
}
