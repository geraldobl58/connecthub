import { z } from "zod";

// Schema para criação de stage (para API)
export const createStageSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome deve ter no máximo 100 caracteres.",
    }),
  type: z.enum(["SALES", "SUPPORT"]).default("SALES"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, {
      message: "Cor deve estar no formato hexadecimal (#RRGGBB).",
    })
    .optional(),
});

// Schema para formulário de criação de stage
export const createStageFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome deve ter no máximo 100 caracteres.",
    }),
  type: z.enum(["SALES", "SUPPORT"]).default("SALES"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, {
      message: "Cor deve estar no formato hexadecimal (#RRGGBB).",
    })
    .default("#3B82F6"),
});

// Schema para atualização de stage
export const updateStageSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório.",
    })
    .max(100, {
      message: "Nome deve ter no máximo 100 caracteres.",
    })
    .optional(),
  type: z.enum(["SALES", "SUPPORT"]).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, {
      message: "Cor deve estar no formato hexadecimal (#RRGGBB).",
    })
    .optional(),
  isWon: z.boolean().optional(),
  isLost: z.boolean().optional(),
});

// Schema para reordenação de stages
export const reorderStagesSchema = z.object({
  stageIds: z
    .array(
      z.string().min(1, {
        message: "ID do stage é obrigatório.",
      })
    )
    .min(1, {
      message: "Pelo menos um stage deve ser fornecido.",
    }),
});

// Schema para ID de stage
export const stageIdSchema = z.object({
  id: z.string().min(1, {
    message: "ID do stage é obrigatório.",
  }),
});

// Types
export type CreateStageValues = z.infer<typeof createStageSchema>;
export type CreateStageFormValues = z.infer<typeof createStageFormSchema>;
export type UpdateStageValues = z.infer<typeof updateStageSchema>;
export type ReorderStagesValues = z.infer<typeof reorderStagesSchema>;
export type StageIdValues = z.infer<typeof stageIdSchema>;

// Backward compatibility
export const stageSchema = createStageSchema;
export type StageValues = CreateStageValues;
