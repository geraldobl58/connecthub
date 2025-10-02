import { z } from "zod";

// Enums que correspondem ao backend
export const PropertyType = {
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  CONDO: "CONDO",
  LAND: "LAND",
  COMMERCIAL: "COMMERCIAL",
} as const;

export const PropertyStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  RENTED: "RENTED",
} as const;

// Schema para endereço
export const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  zipCode: z.string().min(8, "CEP deve ter pelo menos 8 caracteres"),
  country: z.string().optional(),
});

// Schema para criação de propriedade
export const createPropertySchema = z.object({
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código deve ter no máximo 20 caracteres"),
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional(),
  type: z.nativeEnum(PropertyType, {
    message: "Tipo de propriedade é obrigatório",
  }),
  status: z
    .nativeEnum(PropertyStatus)
    .optional()
    .default(PropertyStatus.ACTIVE),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero").optional(),
  bedroom: z
    .number()
    .int("Número de quartos deve ser um número inteiro")
    .min(0, "Número de quartos deve ser maior ou igual a zero")
    .optional(),
  bathroom: z
    .number()
    .int("Número de banheiros deve ser um número inteiro")
    .min(0, "Número de banheiros deve ser maior ou igual a zero")
    .optional(),
  parking: z
    .number()
    .int("Número de vagas deve ser um número inteiro")
    .min(0, "Número de vagas deve ser maior ou igual a zero")
    .optional(),
  area: z.number().min(0, "Área deve ser maior ou igual a zero").optional(),
  address: addressSchema.optional(),
  features: z.record(z.string(), z.any()).optional(),
  ownerId: z.string().optional(),
});

// Schema para atualização de propriedade (todos os campos opcionais)
export const updatePropertySchema = createPropertySchema.partial();

// Types inferidos dos schemas
export type CreatePropertyValues = z.infer<typeof createPropertySchema>;
export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>;
export type AddressValues = z.infer<typeof addressSchema>;

// Type para resposta da API
export interface PropertyResponse {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description?: string;
  type: keyof typeof PropertyType;
  status: keyof typeof PropertyStatus;
  price?: number;
  bedroom?: number;
  bathroom?: number;
  parking?: number;
  area?: number;
  address?: {
    id: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
  };
  features?: Record<string, unknown>;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Labels para os enums
export const PROPERTY_TYPE_LABELS: Record<keyof typeof PropertyType, string> = {
  HOUSE: "Casa",
  APARTMENT: "Apartamento",
  CONDO: "Condomínio",
  LAND: "Terreno",
  COMMERCIAL: "Comercial",
};

export const PROPERTY_STATUS_LABELS: Record<
  keyof typeof PropertyStatus,
  string
> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  RESERVED: "Reservado",
  SOLD: "Vendido",
  RENTED: "Alugado",
};

// Função para formatar preço
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

// Função para formatar área
export const formatArea = (area: number): string => {
  return `${area.toFixed(1)} m²`;
};
