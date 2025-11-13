import { api } from "@/lib/api-client";
import {
  ContractsListResponse,
  ContractsQueryParams,
  ContractResponse,
  CreateContract,
  UpdateContract,
} from "../types/contract";

/**
 * Listar contratos com paginação e filtro
 */
export const getContracts = async (
  params?: ContractsQueryParams
): Promise<ContractsListResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);

  const response = await api.get<ContractsListResponse>(
    `contracts${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  );
  return response.json();
};

/**
 * Buscar contrato por ID
 */
export const getContractById = async (
  id: string
): Promise<ContractResponse> => {
  const response = await api.get<ContractResponse>(`contracts/${id}`);
  return response.json();
};

/**
 * Criar novo contrato
 */
export const createContract = async (
  data: CreateContract
): Promise<ContractResponse> => {
  const response = await api.post<ContractResponse>("contracts", {
    json: data,
  });
  return response.json();
};

/**
 * Atualizar contrato
 */
export const updateContract = async (
  id: string,
  data: UpdateContract
): Promise<ContractResponse> => {
  const response = await api.patch<ContractResponse>(`contracts/${id}`, {
    json: data,
  });
  return response.json();
};

/**
 * Deletar contrato
 */
export const deleteContract = async (id: string): Promise<void> => {
  await api.delete(`contracts/${id}`);
};
