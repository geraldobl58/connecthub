import { api } from "@/lib/api-client";
import {
  ClientsListResponse,
  ClientsQueryParams,
  ClientResponse,
  CreateClient,
  UpdateClient,
} from "../types/client";

/**
 * Listar clientes com paginação e filtro
 */
export const getClients = async (
  params?: ClientsQueryParams
): Promise<ClientsListResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);

  const response = await api.get<ClientsListResponse>(
    `clients${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  );
  return response.json();
};

/**
 * Listar TODOS os clientes (sem paginação) - para selects
 */
export const getAllClients = async (): Promise<ClientResponse[]> => {
  const response = await api.get<ClientResponse[]>("clients/list/all");
  return response.json();
};

/**
 * Buscar cliente por ID
 */
export const getClientById = async (id: string): Promise<ClientResponse> => {
  const response = await api.get<ClientResponse>(`clients/${id}`);
  return response.json();
};

/**
 * Criar novo cliente
 */
export const createClient = async (
  data: CreateClient
): Promise<ClientResponse> => {
  const response = await api.post<ClientResponse>("clients", {
    json: data,
  });
  return response.json();
};

/**
 * Atualizar cliente
 */
export const updateClient = async (
  id: string,
  data: UpdateClient
): Promise<ClientResponse> => {
  const response = await api.patch<ClientResponse>(`clients/${id}`, {
    json: data,
  });
  return response.json();
};

/**
 * Deletar cliente
 */
export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`clients/${id}`);
};
