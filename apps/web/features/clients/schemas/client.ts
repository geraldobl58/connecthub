import { z } from "zod";

export const ClientResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  number: z.string(),
  complement: z.string().nullable(),
  neighborhood: z.string(),
  zipCode: z.string(),
  phone: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ClientResponse = z.infer<typeof ClientResponseSchema>;

export const ClientsListResponseSchema = z.object({
  data: z.array(ClientResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pageSize: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type ClientsListResponse = z.infer<typeof ClientsListResponseSchema>;

export const CreateClientSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres",
  }),
  email: z
    .string()
    .min(2, {
      message: "Email deve ter pelo menos 2 caracteres",
    })
    .email("Email inválido"),
  address: z.string().min(5, {
    message: "Endereço inválido",
  }),
  number: z.string().min(1, {
    message: "Número é obrigatório",
  }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, {
    message: "Bairro é obrigatório",
  }),
  zipCode: z.string().min(8, {
    message: "O cep é obrigatório e deve ter pelo menos 8 caracteres",
  }),
  phone: z.string().min(11, {
    message: "O telefone é obrigatório e deve ter pelo menos 11 caracteres",
  }),
});

export type CreateClient = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = CreateClientSchema.partial();

export type UpdateClient = z.infer<typeof UpdateClientSchema>;

export const ClientsQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export type ClientsQueryParams = z.infer<typeof ClientsQueryParamsSchema>;
