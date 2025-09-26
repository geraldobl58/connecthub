import { z } from "zod";

export const signupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  contactName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  contactEmail: z.string().email("Email inválido"),
  domain: z
    .string()
    .min(3, "Domínio deve ter pelo menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens")
    .refine(
      (val) => !val.startsWith("-") && !val.endsWith("-"),
      "Domínio não pode começar ou terminar com hífen"
    ),
  plan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]),
});

export type SignupValues = z.infer<typeof signupSchema>;
