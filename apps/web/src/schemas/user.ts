import { z } from "zod";

// Schema para criação de usuário
export const createUserSchema = z.object({
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

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .optional(),
  email: z
    .string()
    .email({
      message: "O e-mail deve ser válido.",
    })
    .optional(),
  role: z.enum(["ADMIN", "MANAGER", "AGENT", "VIEWER"]).optional(),
  isActive: z.boolean().optional(),
});

// Schema para parâmetros de listagem
export const userListParamsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER", "AGENT", "VIEWER"]).optional(),
  isActive: z.boolean().optional(),
});

// Schema para ID de usuário
export const userIdSchema = z.object({
  id: z.string().min(1, {
    message: "ID do usuário é obrigatório.",
  }),
});

// Types
export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type UserListParamsValues = z.infer<typeof userListParamsSchema>;
export type UserIdValues = z.infer<typeof userIdSchema>;

// Backward compatibility
export const userSchema = createUserSchema;
export type UserValues = CreateUserValues;
