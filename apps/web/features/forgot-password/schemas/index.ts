import { z } from "zod";

export const formForgotPasswordSchema = z.object({
  tenantId: z.string().min(2, {
    message: "Tenant ID deve ter no mínimo 2 caracteres",
  }),
  email: z
    .string()
    .min(2, {
      message: "Email inválido",
    })
    .email({
      message: "Formato de email inválido",
    }),
});

export type FormForgotPasswordData = z.infer<typeof formForgotPasswordSchema>;
