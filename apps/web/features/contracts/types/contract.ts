import {
  ContractResponse,
  CreateContract,
  UpdateContract,
  ContractsListResponse,
  ContractsQueryParams,
} from "../schemas/contract";

export type {
  ContractResponse,
  CreateContract,
  UpdateContract,
  ContractsListResponse,
  ContractsQueryParams,
};

export interface ContractsInfoResponse {
  success: boolean;
  message?: string;
  data?: ContractsListResponse;
}

export interface ContractDetailResponse {
  success: boolean;
  message?: string;
  data?: ContractResponse;
}

export interface ContractActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
