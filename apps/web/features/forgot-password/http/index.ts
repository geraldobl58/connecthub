import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ForgotPasswordApiResponse,
} from "../types";
import { api } from "@/lib/api-client";

/**
 * Envia requisição de recuperação de senha
 * Usa uma instância de ky sem autenticação pois não requer token pré-existente
 * @param data - Dados da requisição (email e tenantId)
 * @returns Promise com dados de resposta incluindo mensagem de sucesso
 * @throws HTTPError se a requisição falhar
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  const response = await api
    .post("auth/forgot-password", {
      json: {
        email: data.email,
        tenantId: data.tenantId,
      },
    })
    .json<ForgotPasswordApiResponse>();

  // Transformar resposta da API para o formato esperado
  return {
    success: response.success || true,
    message: response.message || "Email de recuperação enviado com sucesso",
  };
}
