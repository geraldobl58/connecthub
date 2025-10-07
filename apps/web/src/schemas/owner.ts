import { z } from "zod";

// Schema para criação de owner (para API)
export const createOwnerSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome deve ter no máximo 100 caracteres.",
    }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s\(\)\-\+]+$/.test(val), {
      message:
        "Telefone deve conter apenas números, espaços, parênteses, hífens e sinais de mais.",
    }),
  email: z
    .string()
    .email({
      message: "Email deve ter um formato válido.",
    })
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, {
      message: "Observações devem ter no máximo 500 caracteres.",
    })
    .optional(),
});

// Schema para formulário de criação de owner
export const createOwnerFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome deve ter no máximo 100 caracteres.",
    }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s\(\)\-\+]+$/.test(val), {
      message:
        "Telefone deve conter apenas números, espaços, parênteses, hífens e sinais de mais.",
    }),
  email: z
    .string()
    .email({
      message: "Email deve ter um formato válido.",
    })
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, {
      message: "Observações devem ter no máximo 500 caracteres.",
    })
    .optional(),
});

// Schema para atualização de owner
export const updateOwnerSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome deve ter no máximo 100 caracteres.",
    })
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s\(\)\-\+]+$/.test(val), {
      message:
        "Telefone deve conter apenas números, espaços, parênteses, hífens e sinais de mais.",
    }),
  email: z
    .string()
    .email({
      message: "Email deve ter um formato válido.",
    })
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, {
      message: "Observações devem ter no máximo 500 caracteres.",
    })
    .optional(),
});

// Schema para ID de owner
export const ownerIdSchema = z.object({
  id: z.string().min(1, {
    message: "ID do proprietário é obrigatório.",
  }),
});

// Types
export type CreateOwnerValues = z.infer<typeof createOwnerSchema>;
export type CreateOwnerFormValues = z.infer<typeof createOwnerFormSchema>;
export type UpdateOwnerValues = z.infer<typeof updateOwnerSchema>;
export type OwnerIdValues = z.infer<typeof ownerIdSchema>;

// Backward compatibility
export const ownerSchema = createOwnerSchema;
export type OwnerValues = CreateOwnerValues;
