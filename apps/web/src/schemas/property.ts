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

// Schema para endereço (seguindo o modelo Address do Prisma)
export const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  zip: z.string().min(8, "CEP deve ter pelo menos 8 caracteres"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Schema para mídia (seguindo o modelo Media do Prisma)
export const mediaSchema = z.object({
  url: z.string().url("URL inválida"),
  alt: z.string().optional(),
  isCover: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
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
  type: z
    .enum(["HOUSE", "APARTMENT", "CONDO", "LAND", "COMMERCIAL"], {
      message: "Tipo de propriedade é obrigatório",
    })
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "RESERVED", "SOLD", "RENTED"], {
      message: "Status da propriedade é obrigatório",
    })
    .optional(),
  price: z.number().min(0.01, "Preço deve ser maior que zero").optional(),
  bedroom: z
    .number()
    .int("Número de quartos deve ser um número inteiro")
    .min(1, "Número de quartos deve ser pelo menos 1"),
  bathroom: z
    .number()
    .int("Número de banheiros deve ser um número inteiro")
    .min(1, "Número de banheiros deve ser pelo menos 1"),
  parking: z
    .number()
    .int("Número de vagas deve ser um número inteiro")
    .min(0, "Número de vagas deve ser maior ou igual a zero"),
  area: z.number().min(0.01, "Área deve ser maior que zero"),
  address: addressSchema,
  features: z.record(z.string(), z.any()).optional(),
  ownerId: z.string().optional(),
  media: z
    .array(mediaSchema)
    .min(1, "Pelo menos uma imagem é obrigatória")
    .optional(),
});

// Schema para atualização de propriedade (todos os campos opcionais)
export const updatePropertySchema = createPropertySchema.partial();

// Types inferidos dos schemas
export type CreatePropertyValues = z.infer<typeof createPropertySchema>;
export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>;
export type AddressValues = z.infer<typeof addressSchema>;
export type MediaValues = z.infer<typeof mediaSchema>;

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
    street?: string;
    number?: string;
    district?: string;
    city: string;
    state: string;
    zip?: string;
    lat?: number;
    lng?: number;
  };
  features?: Record<string, unknown>;
  ownerId?: string;
  media?: {
    id: string;
    url: string;
    alt?: string;
    isCover: boolean;
    order: number;
  }[];
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

// Função para transformar dados do formulário para o formato da API
export const transformToApiFormat = (
  data: CreatePropertyValues & { media?: any[] }
) => {
  const { address, ...rest } = data;

  return {
    ...rest,
    price: data.price ? data.price.toString() : undefined, // Convert to string for backend
    address: {
      street: `${address.street}, ${address.number}`, // Combinar street e number
      district: address.district, // Usar district (não neighborhood)
      city: address.city,
      state: address.state,
      zip: address.zip, // Usar zip (não zipCode)
      lat: address.lat,
      lng: address.lng,
    },
    // Não incluir media na atualização por enquanto para evitar problemas
    // media: data.media || [],
    ownerId: data.ownerId || undefined,
    features: data.features || undefined,
  };
};
