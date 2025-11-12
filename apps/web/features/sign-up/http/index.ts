import { env } from "@/lib/env";
import { SignUpRequest, SignUpResponse } from "../types";
import { api } from "@/lib/api-client";

/**
 * Realiza o signup de uma nova empresa
 * Usa uma instância de ky sem autenticação pois signup não requer token
 * @param data - Dados de signup do usuário/empresa
 * @returns Promise com dados de resposta do signup
 * @throws HTTPError se a requisição falhar
 */
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  // Construir URLs de sucesso e cancelamento
  const successUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/success`;
  const cancelUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/register`;

  const response = await api
    .post("auth/signup", {
      json: {
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        domain: data.domain,
        plan: data.plan,
        successUrl,
        cancelUrl,
      },
    })
    .json<SignUpResponse>();

  return response;
}
