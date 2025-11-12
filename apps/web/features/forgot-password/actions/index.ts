"use server";

import { HTTPError } from "ky";
import { formForgotPasswordSchema } from "../schemas";
import { forgotPassword } from "../http";

export type ForgotPasswordActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]> | null;
};

/**
 * Server Action para enviar requisicao de recuperacao de senha
 * @param formData - FormData contendo dados de recuperacao (email e tenantId)
 * @returns Resultado da acao com status de sucesso/erro
 */
export async function forgotPasswordAction(
  formData: FormData
): Promise<ForgotPasswordActionState> {
  try {
    // Parse e validacao dos dados
    const rawData = Object.fromEntries(formData);
    const validationResult = formForgotPasswordSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        success: false,
        message: "Validacao falhou. Verifique os campos.",
        errors: fieldErrors,
      };
    }

    const formData_ = validationResult.data;

    // Chamada a API
    const response = await forgotPassword({
      email: formData_.email,
      tenantId: formData_.tenantId,
    });

    // Verificar se a requisicao foi bem-sucedida
    if (!response.success) {
      console.error("[ForgotPassword API Error]", {
        message: response.message,
        response: response,
      });

      return {
        success: false,
        message: response.message || "Erro ao enviar email de recuperacao",
      };
    }

    // Retornar resposta com mensagem de sucesso
    return {
      success: true,
      message:
        response.message ||
        "Email de recuperacao enviado com sucesso. Verifique sua caixa de entrada.",
    };
  } catch (error) {
    console.error("[ForgotPassword Action Error]", error);

    if (error instanceof HTTPError) {
      try {
        const errorData = (await error.response.json()) as { message?: string };
        return {
          success: false,
          message:
            errorData.message || "Erro ao conectar com a API. Tente novamente.",
        };
      } catch {
        return {
          success: false,
          message: "Erro ao processar resposta do servidor.",
        };
      }
    }

    return {
      success: false,
      message: "Erro inesperado. Tente novamente mais tarde.",
    };
  }
}
