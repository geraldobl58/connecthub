import { z } from "zod";

// Schema para criação de property (para API)
export const createPropertySchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Código é obrigatório.",
    })
    .max(20, {
      message: "Código deve ter no máximo 20 caracteres.",
    }),
  title: z
    .string()
    .min(1, {
      message: "Título é obrigatório.",
    })
    .max(200, {
      message: "Título deve ter no máximo 200 caracteres.",
    }),
  description: z
    .string()
    .max(1000, {
      message: "Descrição deve ter no máximo 1000 caracteres.",
    })
    .optional(),
  type: z.enum(["HOUSE", "APARTMENT", "CONDO", "LAND", "COMMERCIAL"], {
    message: "Tipo deve ser HOUSE, APARTMENT, CONDO, LAND ou COMMERCIAL.",
  }),
  status: z
    .enum(["ACTIVE", "INACTIVE", "RESERVED", "SOLD", "RENTED"], {
      message: "Status deve ser ACTIVE, INACTIVE, RESERVED, SOLD ou RENTED.",
    })
    .optional(),
  price: z
    .number()
    .min(0, {
      message: "Preço deve ser maior ou igual a zero.",
    })
    .optional(),
  minPrice: z
    .number()
    .min(0, {
      message: "Preço mínimo deve ser maior ou igual a zero.",
    })
    .optional(),
  maxPrice: z
    .number()
    .min(0, {
      message: "Preço máximo deve ser maior ou igual a zero.",
    })
    .optional(),
  bedroom: z
    .number()
    .int()
    .min(0, {
      message: "Número de quartos deve ser maior ou igual a zero.",
    })
    .optional(),
  bathroom: z
    .number()
    .int()
    .min(0, {
      message: "Número de banheiros deve ser maior ou igual a zero.",
    })
    .optional(),
  parking: z
    .number()
    .int()
    .min(0, {
      message: "Número de vagas deve ser maior ou igual a zero.",
    })
    .optional(),
  area: z
    .number()
    .min(0, {
      message: "Área deve ser maior ou igual a zero.",
    })
    .optional(),
  ownerId: z
    .string()
    .uuid({
      message: "ID do proprietário deve ser um UUID válido.",
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      number: z.string().optional(),
      district: z.string().optional(),
      city: z
        .string()
        .min(1, {
          message: "Cidade é obrigatória.",
        })
        .max(100, {
          message: "Cidade deve ter no máximo 100 caracteres.",
        }),
      state: z
        .string()
        .min(2, {
          message: "Estado deve ter pelo menos 2 caracteres.",
        })
        .max(2, {
          message: "Estado deve ter no máximo 2 caracteres.",
        }),
      zip: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, {
          message: "CEP deve estar no formato 00000-000.",
        })
        .optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  features: z.record(z.string(), z.any()).optional(),
  coverImage: z.string().url("URL da imagem de capa inválida.").optional(),
  galleryImages: z.array(z.string().url("URL de imagem inválida.")).optional(),
});

// Schema para formulário de criação de property
export const createPropertyFormSchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Código é obrigatório.",
    })
    .max(20, {
      message: "Código deve ter no máximo 20 caracteres.",
    }),
  title: z
    .string()
    .min(1, {
      message: "Título é obrigatório.",
    })
    .max(200, {
      message: "Título deve ter no máximo 200 caracteres.",
    }),
  description: z
    .string()
    .max(1000, {
      message: "Descrição deve ter no máximo 1000 caracteres.",
    })
    .optional(),
  type: z.enum(["HOUSE", "APARTMENT", "CONDO", "LAND", "COMMERCIAL"], {
    message: "Tipo deve ser HOUSE, APARTMENT, CONDO, LAND ou COMMERCIAL.",
  }),
  status: z
    .enum(["ACTIVE", "INACTIVE", "RESERVED", "SOLD", "RENTED"], {
      message: "Status deve ser ACTIVE, INACTIVE, RESERVED, SOLD ou RENTED.",
    })
    .default("ACTIVE"),
  price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Preço deve ser maior ou igual a zero." }).optional()
  ),
  minPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Preço mínimo deve ser maior ou igual a zero." }).optional()
  ),
  maxPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Preço máximo deve ser maior ou igual a zero." }).optional()
  ),
  bedroom: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(0, { message: "Número de quartos deve ser maior ou igual a zero." }).optional()
  ),
  bathroom: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(0, { message: "Número de banheiros deve ser maior ou igual a zero." }).optional()
  ),
  parking: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(0, { message: "Número de vagas deve ser maior ou igual a zero." }).optional()
  ),
  area: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Área deve ser maior ou igual a zero." }).optional()
  ),
  ownerId: z
    .string()
    .uuid({
      message: "ID do proprietário deve ser um UUID válido.",
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      number: z.string().optional(),
      district: z.string().optional(),
      city: z
        .string()
        .min(1, {
          message: "Cidade é obrigatória.",
        })
        .max(100, {
          message: "Cidade deve ter no máximo 100 caracteres.",
        }),
      state: z
        .string()
        .min(2, {
          message: "Estado deve ter pelo menos 2 caracteres.",
        })
        .max(2, {
          message: "Estado deve ter no máximo 2 caracteres.",
        }),
      zip: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, {
          message: "CEP deve estar no formato 00000-000.",
        })
        .optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  features: z.record(z.string(), z.any()).optional(),
  coverImage: z.string().url("URL da imagem de capa inválida.").optional(),
  galleryImages: z.array(z.string().url("URL de imagem inválida.")).optional(),
});

// Schema para atualização de property
export const updatePropertySchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Código é obrigatório.",
    })
    .max(20, {
      message: "Código deve ter no máximo 20 caracteres.",
    })
    .optional(),
  title: z
    .string()
    .min(1, {
      message: "Título é obrigatório.",
    })
    .max(200, {
      message: "Título deve ter no máximo 200 caracteres.",
    })
    .optional(),
  description: z
    .string()
    .max(1000, {
      message: "Descrição deve ter no máximo 1000 caracteres.",
    })
    .optional(),
  type: z
    .enum(["HOUSE", "APARTMENT", "CONDO", "LAND", "COMMERCIAL"], {
      message: "Tipo deve ser HOUSE, APARTMENT, CONDO, LAND ou COMMERCIAL.",
    })
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "RESERVED", "SOLD", "RENTED"], {
      message: "Status deve ser ACTIVE, INACTIVE, RESERVED, SOLD ou RENTED.",
    })
    .optional(),
  price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Preço deve ser maior ou igual a zero." }).optional()
  ),
  minPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Preço mínimo deve ser maior ou igual a zero." }).optional()
  ),
  maxPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Preço máximo deve ser maior ou igual a zero." }).optional()
  ),
  bedroom: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(0, { message: "Número de quartos deve ser maior ou igual a zero." }).optional()
  ),
  bathroom: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(0, { message: "Número de banheiros deve ser maior ou igual a zero." }).optional()
  ),
  parking: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(0, { message: "Número de vagas deve ser maior ou igual a zero." }).optional()
  ),
  area: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: "Área deve ser maior ou igual a zero." }).optional()
  ),
  ownerId: z
    .string()
    .uuid({
      message: "ID do proprietário deve ser um UUID válido.",
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      number: z.string().optional(),
      district: z.string().optional(),
      city: z
        .string()
        .min(1, {
          message: "Cidade é obrigatória.",
        })
        .max(100, {
          message: "Cidade deve ter no máximo 100 caracteres.",
        }),
      state: z
        .string()
        .min(2, {
          message: "Estado deve ter pelo menos 2 caracteres.",
        })
        .max(2, {
          message: "Estado deve ter no máximo 2 caracteres.",
        }),
      zip: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, {
          message: "CEP deve estar no formato 00000-000.",
        })
        .optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  features: z.record(z.string(), z.any()).optional(),
  coverImage: z.string().url("URL da imagem de capa inválida.").optional(),
  galleryImages: z.array(z.string().url("URL de imagem inválida.")).optional(),
});

// Schema para ID de property
export const propertyIdSchema = z.object({
  id: z.string().min(1, {
    message: "ID da propriedade é obrigatório.",
  }),
});

// Types
export type CreatePropertyValues = z.infer<typeof createPropertySchema>;
export type CreatePropertyFormValues = z.infer<typeof createPropertyFormSchema>;
export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>;
export type PropertyIdValues = z.infer<typeof propertyIdSchema>;

// Backward compatibility
export const propertySchema = createPropertySchema;
export type PropertyValues = CreatePropertyValues;
