"use server";

import { HTTPError } from "ky";
import {
  ClientsInfoResponse,
  ClientDetailResponse,
  ClientsQueryParams,
  CreateClient,
  UpdateClient,
  ClientActionResponse,
} from "../types/client";
import {
  getClients,
  getAllClients,
  getClientById,
  createClient as createClientHttp,
  updateClient as updateClientHttp,
  deleteClient as deleteClientHttp,
} from "../http/client";

/**
 * Listar clientes com paginação e filtro
 */
export async function getClientsAction(
  params?: ClientsQueryParams
): Promise<ClientsInfoResponse> {
  try {
    const response = await getClients(params);

    return {
      success: true,
      message: "Clientes recuperados com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Clients Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message: errorData.message || "Erro ao conectar com a API",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado ao recuperar clientes",
    };
  }
}

/**
 * Listar TODOS os clientes (sem paginação) - para selects
 */
export async function getAllClientsAction(): Promise<{
  success: boolean;
  message?: string;
  data?: any[];
}> {
  try {
    const response = await getAllClients();

    return {
      success: true,
      message: "Clientes recuperados com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Get All Clients Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message: errorData.message || "Erro ao conectar com a API",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado ao recuperar clientes",
    };
  }
}

/**
 * Obter cliente por ID
 */
export async function getClientByIdAction(
  id: string
): Promise<ClientDetailResponse> {
  try {
    const response = await getClientById(id);

    return {
      success: true,
      message: "Cliente recuperado com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Get Client Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message: errorData.message || "Cliente não encontrado",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado ao recuperar cliente",
    };
  }
}

/**
 * Criar novo cliente
 */
export async function createClientAction(
  data: CreateClient
): Promise<ClientActionResponse> {
  try {
    const response = await createClientHttp(data);

    return {
      success: true,
      message: "Cliente criado com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Create Client Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message:
            errorData.message || "Erro ao criar cliente. Verifique os dados",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado ao criar cliente",
    };
  }
}

/**
 * Atualizar cliente
 */
export async function updateClientAction(
  id: string,
  data: UpdateClient
): Promise<ClientActionResponse> {
  try {
    const response = await updateClientHttp(id, data);

    return {
      success: true,
      message: "Cliente atualizado com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Update Client Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message:
            errorData.message ||
            "Erro ao atualizar cliente. Verifique os dados",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado ao atualizar cliente",
    };
  }
}

/**
 * Deletar cliente
 */
export async function deleteClientAction(
  id: string
): Promise<ClientActionResponse> {
  try {
    await deleteClientHttp(id);

    return {
      success: true,
      message: "Cliente deletado com sucesso",
    };
  } catch (error) {
    console.error("[Delete Client Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message: errorData.message || "Erro ao deletar cliente",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado ao deletar cliente",
    };
  }
}
