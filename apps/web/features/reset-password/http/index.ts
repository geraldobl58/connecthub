import {
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResetPasswordApiResponse,
} from "../types";
import { api } from "@/lib/api-client";

/**
 * Envia requisicao de redefinicao de senha
 * Usa uma instancia de ky sem autenticacao pois nao requer token pre-existente
 * @param data - Dados da requisicao (token e newPassword)
 * @returns Promise com dados de resposta incluindo mensagem de sucesso
 * @throws HTTPError se a requisicao falhar
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const response = await api
    .post("auth/reset-password", {
      json: {
        token: data.token,
        newPassword: data.newPassword,
      },
    })
    .json<ResetPasswordApiResponse>();

  // Transformar resposta da API para o formato esperado
  return {
    success: response.success || true,
    message: response.message || "Senha redefinida com sucesso",
  };
}
