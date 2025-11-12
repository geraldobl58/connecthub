"use server";

import { HTTPError } from "ky";

import { signUp } from "../http";
import { formSignUpSchema } from "../schemas";

export type SignUpActionState = {
  success: boolean;
  message?: string;
  checkoutUrl?: string;
  isTrial?: boolean;
  tenantSlug?: string;
  errors?: Record<string, string[]> | null;
};

/**
 * Server Action para realizar signup de nova empresa
 * @param formData - FormData contendo dados do signup
 * @returns Resultado da ação com status de sucesso/erro
 */
export async function signUpAction(
  formData: FormData
): Promise<SignUpActionState> {
  try {
    // Parse e validação dos dados
    const rawData = Object.fromEntries(formData);
    const validationResult = formSignUpSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        success: false,
        message: "Validação falhou. Verifique os campos.",
        errors: fieldErrors,
      };
    }

    const formData_ = validationResult.data;

    // Log para debug (remover em produção)
    console.log("[SignUp Debug]", {
      companyName: formData_.companyName,
      contactName: formData_.contactName,
      contactEmail: formData_.contactEmail,
      domain: formData_.domain,
      plan: formData_.plan,
      planType: typeof formData_.plan,
    });

    // Chamada à API
    const response = await signUp({
      companyName: formData_.companyName,
      contactName: formData_.contactName,
      contactEmail: formData_.contactEmail,
      domain: formData_.domain,
      plan: formData_.plan,
    });

    // Verificar se o signup foi bem-sucedido
    if (!response.success) {
      console.error("[SignUp API Error]", {
        message: response.message,
        response: response,
      });

      return {
        success: false,
        message: response.message || "Erro ao realizar signup",
      };
    }

    // Se for TRIAL, retornar flag para redirecionar
    if (response.isTrial) {
      return {
        success: true,
        message:
          "Conta criada com sucesso! Verifique seu email para acessar sua conta.",
        isTrial: true,
        tenantSlug: response.tenant?.slug,
      };
    }

    // Usuário receberá email com dados de acesso, não salvar token aqui
    // O usuário será redirecionado para checkout do Stripe se houver checkoutUrl
    if (response.checkoutUrl) {
      // Stripe redirect será feito na página
      return {
        success: true,
        message:
          "Redirecionando para pagamento. Você receberá um email com os dados de acesso após a conclusão.",
        checkoutUrl: response.checkoutUrl,
      };
    }

    return {
      success: true,
      message:
        "Conta criada com sucesso! Verifique seu email para acessar sua conta.",
    };
  } catch (error) {
    console.error("[SignUp Action Error]", error);

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
