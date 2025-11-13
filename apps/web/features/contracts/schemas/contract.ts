import { z } from "zod";
import { ClientResponseSchema } from "@/features/clients/schemas/client";

export const ContractResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  identifier: z.string(),
  content: z.string().nullable(),
  initialEffectiveDate: z.string().datetime(),
  finalEffectiveDate: z.string().datetime(),
  clientId: z.string().uuid().nullable(),
  clients: ClientResponseSchema.nullable(),
  signedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ContractResponse = z.infer<typeof ContractResponseSchema>;

export const ContractsListResponseSchema = z.object({
  data: z.array(ContractResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pageSize: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type ContractsListResponse = z.infer<typeof ContractsListResponseSchema>;

export const CreateContractSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  identifier: z.string().min(1, "Identificador é obrigatório"),
  content: z.string().optional(),
  initialEffectiveDate: z.string().datetime(),
  finalEffectiveDate: z.string().datetime(),
  clientId: z.string().uuid().optional().nullable(),
  signedAt: z.string().datetime().optional().nullable(),
});

export type CreateContract = z.infer<typeof CreateContractSchema>;

export const UpdateContractSchema = CreateContractSchema.partial();

export type UpdateContract = z.infer<typeof UpdateContractSchema>;

export const ContractsQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type ContractsQueryParams = z.infer<typeof ContractsQueryParamsSchema>;
