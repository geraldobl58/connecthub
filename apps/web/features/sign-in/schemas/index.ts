import { z } from "zod";

export const formSignInSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(5, "Email deve ter pelo menos 5 caracteres"),

  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha não pode exceder 100 caracteres"),

  tenantId: z
    .string()
    .min(1, "ID do Tenant é obrigatório"),

  twoFactorToken: z.string().optional(),
});

export type FormSignInData = z.infer<typeof formSignInSchema>;
