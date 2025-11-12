import { z } from "zod";

export const formSignUpSchema = z.object({
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa não pode exceder 100 caracteres"),

  contactName: z
    .string()
    .min(2, "Nome completo deve ter pelo menos 2 caracteres")
    .max(100, "Nome completo não pode exceder 100 caracteres"),

  contactEmail: z
    .string()
    .email("Email inválido")
    .min(5, "Email deve ter pelo menos 5 caracteres"),

  domain: z
    .string()
    .min(3, "Domínio deve ter pelo menos 3 caracteres")
    .max(50, "Domínio não pode exceder 50 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Domínio deve conter apenas letras, números e hífen"
    ),

  plan: z.enum(["TRIAL", "STARTER", "PROFESSIONAL", "ENTERPRISE"]),
});

export type FormSignUpData = z.infer<typeof formSignUpSchema>;
