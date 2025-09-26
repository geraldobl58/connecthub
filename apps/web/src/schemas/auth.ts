import { z } from "zod";

// Schema para login - corresponde ao LoginDto do backend
export const loginSchema = z.object({
  email: z.string().email({
    message: "O e-mail deve ser válido.",
  }),
  password: z
    .string()
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.",
    }),
  tenantId: z.string().optional().transform(val => {
    if (!val || val.trim() === "" || val.trim() === "$undefined") {
      return undefined;
    }
    return val.trim();
  }).describe("ID do tenant (opcional)"),
});

// Schema para registro - corresponde ao RegisterDto do backend
export const registerSchema = z.object({
  tenantId: z.string().min(1, {
    message: "ID do tenant é obrigatório.",
  }),
  name: z.string().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "O e-mail deve ser válido.",
  }),
  password: z
    .string()
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    })
    .max(20, {
      message: "A senha deve ter no máximo 20 caracteres.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        "A senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.",
    }),
  role: z.enum(["ADMIN", "MANAGER", "AGENT", "VIEWER"]).optional(),
});

// Types
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

// Backward compatibility
export const formAuthSchema = loginSchema;
export type FormAuthValues = LoginValues;
