import { z } from "zod";
import { UserRole } from "../types/users";

// Schemas base reutilizáveis
const nameSchema = z
  .string()
  .min(1, "Nome é obrigatório")
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome deve ter no máximo 100 caracteres")
  .trim();

const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Formato de email inválido")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .min(6, "Senha deve ter pelo menos 6 caracteres")
  .max(100, "Senha deve ter no máximo 100 caracteres");

const roleSchema = z.enum(
  [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.VIEWER],
  {
    message: "Role inválido",
  }
);

// Schema para criar usuário
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  isActive: z.boolean(),
});

// Schema para atualizar usuário
export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    role: roleSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Pelo menos um campo deve ser fornecido
      return Object.keys(data).length > 0;
    },
    {
      message: "Pelo menos um campo deve ser fornecido para atualização",
    }
  );

// Schema para trocar senha
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: passwordSchema,
    confirmNewPassword: z
      .string()
      .min(1, "Confirmação da nova senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

// Schema para filtros de busca
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z
    .enum([UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.VIEWER])
    .optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(["name", "email", "role", "isActive", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schema para validar ID de usuário
export const userIdSchema = z.object({
  id: z.string().uuid("ID de usuário inválido"),
});

// Types derivados dos schemas
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type UserFiltersData = z.infer<typeof userFiltersSchema>;
export type UserIdData = z.infer<typeof userIdSchema>;
