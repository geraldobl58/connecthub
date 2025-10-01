import { ApiError } from "@/types/common";

/**
 * Verificar se o erro é de autenticação
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status === 401;
  }
  return false;
}

/**
 * Extrair mensagem de erro da API
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;

    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }

    if (apiError.response?.status === 401) {
      return "Email ou senha incorretos";
    }

    if (apiError.response?.status === 409) {
      return "Email já está em uso neste tenant";
    }

    if (apiError.response?.status === 400) {
      return "Dados inválidos fornecidos";
    }

    if (apiError.response?.status) {
      return `Erro do servidor (${apiError.response.status})`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido";
}

/**
 * Verificar se o erro é de rede
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return !apiError.response?.status;
  }
  return false;
}

/**
 * Verificar se o erro é de validação
 */
export function isValidationError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status === 400;
  }
  return false;
}

/**
 * Verificar se o erro é de conflito
 */
export function isConflictError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status === 409;
  }
  return false;
}

/**
 * Verificar se o erro é de não encontrado
 */
export function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status === 404;
  }
  return false;
}

/**
 * Verificar se o erro é de permissão
 */
export function isForbiddenError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status === 403;
  }
  return false;
}

/**
 * Obter status code do erro
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.status;
  }
  return undefined;
}

/**
 * Obter dados do erro
 */
export function getErrorData(
  error: unknown
): { message?: string; error?: string; statusCode?: number } | undefined {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.data;
  }
  return undefined;
}
