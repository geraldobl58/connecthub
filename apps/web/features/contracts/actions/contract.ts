"use server";

import { HTTPError } from "ky";
import {
  ContractsInfoResponse,
  ContractDetailResponse,
  ContractsQueryParams,
  CreateContract,
  UpdateContract,
  ContractActionResponse,
} from "../types/contract";
import {
  getContracts,
  getContractById,
  createContract as createContractHttp,
  updateContract as updateContractHttp,
  deleteContract as deleteContractHttp,
} from "../http/contract";

/**
 * Listar contratos com paginação e filtro
 */
export async function getContractsAction(
  params?: ContractsQueryParams
): Promise<ContractsInfoResponse> {
  try {
    const response = await getContracts(params);

    return {
      success: true,
      message: "Contratos recuperados com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Contracts Action Error]", error);

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
      message: "Erro inesperado ao recuperar contratos",
    };
  }
}

/**
 * Obter contrato por ID
 */
export async function getContractByIdAction(
  id: string
): Promise<ContractDetailResponse> {
  try {
    const response = await getContractById(id);

    return {
      success: true,
      message: "Contrato recuperado com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Get Contract Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message: errorData.message || "Contrato não encontrado",
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
      message: "Erro inesperado ao recuperar contrato",
    };
  }
}

/**
 * Criar novo contrato
 */
export async function createContractAction(
  data: CreateContract
): Promise<ContractActionResponse> {
  try {
    const response = await createContractHttp(data);

    return {
      success: true,
      message: "Contrato criado com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Create Contract Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message:
            errorData.message || "Erro ao criar contrato. Verifique os dados",
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
      message: "Erro inesperado ao criar contrato",
    };
  }
}

/**
 * Atualizar contrato
 */
export async function updateContractAction(
  id: string,
  data: UpdateContract
): Promise<ContractActionResponse> {
  try {
    const response = await updateContractHttp(id, data);

    return {
      success: true,
      message: "Contrato atualizado com sucesso",
      data: response,
    };
  } catch (error) {
    console.error("[Update Contract Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message:
            errorData.message ||
            "Erro ao atualizar contrato. Verifique os dados",
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
      message: "Erro inesperado ao atualizar contrato",
    };
  }
}

/**
 * Deletar contrato
 */
export async function deleteContractAction(
  id: string
): Promise<ContractActionResponse> {
  try {
    await deleteContractHttp(id);

    return {
      success: true,
      message: "Contrato deletado com sucesso",
    };
  } catch (error) {
    console.error("[Delete Contract Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as {
          message?: string;
        };
        return {
          success: false,
          message: errorData.message || "Erro ao deletar contrato",
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
      message: "Erro inesperado ao deletar contrato",
    };
  }
}
