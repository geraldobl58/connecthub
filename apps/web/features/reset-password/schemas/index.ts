import { z } from "zod";

export const formResetPasswordSchema = z
  .object({
    token: z.string().optional(),
    newPassword: z.string().min(8, {
      message: "A nova senha deve ter no mínimo 8 caracteres",
    }),
    confirmPassword: z.string().min(8, {
      message: "A confirmação de senha deve ter no mínimo 8 caracteres",
    }),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
      });
    }
  });

export type FormResetPasswordData = z.infer<typeof formResetPasswordSchema>;
