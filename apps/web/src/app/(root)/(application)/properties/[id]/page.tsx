"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CepInput } from "@/components/ui/cep-input";
import { PropertyMediaUpload } from "@/components/property-media-upload";
import { PropertyFeatures } from "@/components/property-features";
import { PropertyOwner } from "@/components/property-owner";
import { useViaCep } from "@/hooks/use-viacep";
import { usePropertyCodeValidation } from "@/hooks/use-property-code-validation";
import {
  useProperty,
  useCreateProperty,
  useUpdateProperty,
} from "@/hooks/use-properties";
import { useMedia } from "@/hooks/use-media";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  createPropertySchema,
  CreatePropertyValues,
  transformToApiFormat,
} from "@/schemas/property";
import { PropertyMedia } from "@/types/property";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function PropertyFormPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string | undefined;
  const isEditMode = !!propertyId && propertyId !== "new";

  const [media, setMedia] = useState<PropertyMedia[]>([]);
  const [features, setFeatures] = useState<Record<string, string>>({});
  const [ownerId, setOwnerId] = useState<string | undefined>();

  const viaCep = useViaCep();

  // Buscar propriedade se estiver editando
  const { property, isLoading: isFetchingProperty } = useProperty(
    isEditMode ? propertyId : ""
  );

  // Mutations
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  // Hook para upload de mídias
  const { uploadTempFiles } = useMedia({ enabled: false });

  const form = useForm<CreatePropertyValues>({
    resolver: zodResolver(createPropertySchema) as any,
    defaultValues: {
      code: "",
      title: "",
      description: "",
      type: undefined,
      status: undefined,
      price: undefined,
      bedroom: 1,
      bathroom: 1,
      parking: 0,
      area: undefined,
      address: {
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        zip: "",
      },
    },
  });

  // Validação de código único
  const currentCode = form.watch("code");
  const codeValidation = usePropertyCodeValidation({
    code: currentCode || "",
    excludeId: isEditMode ? propertyId : undefined,
    enabled: !!currentCode && currentCode.length >= 2,
  });

  // Preencher formulário quando carregar propriedade
  useEffect(() => {
    if (property) {
      // Usar setValue para garantir que o valor seja definido
      if (property.type) {
        form.setValue("type", property.type);
      }
      if (property.status) {
        form.setValue("status", property.status);
      }

      form.reset({
        code: property.code || "",
        title: property.title || "",
        description: property.description || "",
        type: property.type,
        status: property.status,
        price: property.price,
        bedroom: property.bedroom || 1,
        bathroom: property.bathroom || 1,
        parking: property.parking || 0,
        area: property.area,
        address: {
          street: property.address?.street?.split(",")[0]?.trim() || "",
          number: property.address?.street?.split(",")[1]?.trim() || "",
          district: property.address?.district || "",
          city: property.address?.city || "",
          state: property.address?.state || "",
          zip: property.address?.zip || "",
        },
      });

      // Usar setTimeout para garantir que os valores sejam definidos após o render
      setTimeout(() => {
        if (property.type) {
          form.setValue("type", property.type);
        }
        if (property.status) {
          form.setValue("status", property.status);
        }
      }, 100);

      // As mídias são carregadas junto com a propriedade
      if (property.media) {
        setMedia(property.media);
      }

      // Preencher features e ownerId
      if (property.features) {
        setFeatures(property.features as Record<string, string>);
      }
      if (property.ownerId) {
        setOwnerId(property.ownerId);
      }
    }
  }, [property, form]);

  const handleAddressFound = (address: {
    street: string;
    district: string;
    city: string;
    state: string;
  }) => {
    form.setValue("address.street", address.street);
    form.setValue("address.district", address.district);
    form.setValue("address.city", address.city);
    form.setValue("address.state", address.state);
  };

  // Função para gerar código único
  const generateUniqueCode = () => {
    const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos do timestamp
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${timestamp}-${random}`;
  };

  // Função para fazer upload de imagens durante a criação
  const handleUploadFiles = async (files: File[]): Promise<PropertyMedia[]> => {
    try {
      // Fazer upload das imagens como temporárias
      const uploadedFiles = await uploadTempFiles(files);

      // Converter para formato PropertyMedia
      const propertyMedia: PropertyMedia[] = uploadedFiles.map(
        (file, index) => ({
          id: `temp-${Date.now()}-${index}`,
          url: file.url,
          alt: file.alt || "",
          isCover: index === 0, // Primeira imagem é capa
          order: index,
        })
      );

      return propertyMedia;
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
      throw new Error("Erro ao fazer upload das imagens");
    }
  };

  const onSubmit = async (data: CreatePropertyValues) => {
    try {
      // Verificar se o código é válido
      if (data.code && !codeValidation.isValid) {
        toast.error("Por favor, use um código único para a propriedade");
        return;
      }

      // Gerar código único se não foi informado
      const finalData = {
        ...data,
        code: data.code.trim() || generateUniqueCode(),
      };

      // Adicionar mídias, features e ownerId aos dados e transformar para formato da API
      const formDataWithMedia = {
        ...finalData,
        media: media.map((m) => {
          // Remove o ID se for temporário (começa com 'temp-')
          const mediaItem: {
            url: string;
            alt?: string;
            isCover: boolean;
            order: number;
            id?: string;
          } = {
            url: m.url,
            alt: m.alt || undefined,
            isCover: m.isCover,
            order: m.order,
          };

          // Só adiciona o id se não for temporário (editando imagem existente)
          if (m.id && !m.id.startsWith("temp-")) {
            mediaItem.id = m.id;
          }

          return mediaItem;
        }),
        features: features,
        ownerId: ownerId,
      };

      // Transformar para o formato esperado pela API
      const payload = transformToApiFormat(formDataWithMedia) as any;

      if (isEditMode) {
        await updateProperty.mutateAsync({
          id: propertyId,
          data: payload as any,
        });
        toast.success("Propriedade atualizada com sucesso!");
      } else {
        await createProperty.mutateAsync(payload as any);
        toast.success("Propriedade criada com sucesso!");
      }

      router.push("/properties");
    } catch (error: unknown) {
      console.error("Erro ao salvar propriedade:", error);

      // Tratar erro específico de código duplicado
      const errorMessage = (error as any)?.response?.data?.message;
      if (errorMessage?.includes("Property code already exists")) {
        toast.error(
          "Este código de propriedade já existe. Por favor, use um código diferente."
        );
        form.setError("code", {
          type: "manual",
          message: "Este código já está sendo usado por outra propriedade",
        });
      } else if (errorMessage?.includes("Owner not found in this tenant")) {
        toast.error(
          "Proprietário não encontrado. Por favor, selecione um proprietário válido ou crie um novo."
        );
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error(
          isEditMode
            ? "Erro ao atualizar propriedade"
            : "Erro ao criar propriedade"
        );
      }
    }
  };

  const isLoading =
    createProperty.isPending || updateProperty.isPending || isFetchingProperty;

  if (isFetchingProperty && isEditMode) {
    return (
      <>
        <Header
          title="Editar Propriedade"
          description="Edite as informações da propriedade"
        />
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando propriedade...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={isEditMode ? "Editar Propriedade" : "Nova Propriedade"}
        description={
          isEditMode
            ? "Edite as informações da propriedade"
            : "Crie uma nova propriedade no sistema"
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Editar Propriedade" : "Criar Propriedade"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode
              ? "Edite as informações da propriedade."
              : "Crie uma nova propriedade no sistema."}
          </p>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-6"
          >
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">
                      1
                    </span>
                  </div>
                  Informações Básicas
                </CardTitle>
                <CardDescription>
                  Dados principais da propriedade como código, título e
                  descrição
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control as any}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Casa de 3 quartos no centro"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control as any}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <Input
                                placeholder="PROP001"
                                {...field}
                                value={field.value ?? ""}
                                className={`${
                                  codeValidation.isLoading
                                    ? "border-blue-300"
                                    : !codeValidation.isValid && field.value
                                      ? "border-red-300"
                                      : codeValidation.isValid && field.value
                                        ? "border-green-300"
                                        : ""
                                }`}
                              />
                              {codeValidation.isLoading && field.value && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                </div>
                              )}
                              {!codeValidation.isLoading &&
                                !codeValidation.isValid &&
                                field.value && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <X className="h-4 w-4 text-red-500" />
                                  </div>
                                )}
                              {!codeValidation.isLoading &&
                                codeValidation.isValid &&
                                field.value && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-green-500">✓</span>
                                  </div>
                                )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                field.onChange(generateUniqueCode())
                              }
                              className="px-3"
                            >
                              Gerar
                            </Button>
                          </div>
                        </FormControl>
                        {codeValidation.error && (
                          <p className="text-sm text-red-500">
                            {codeValidation.error}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="type"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Tipo *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PROPERTY_TYPE_LABELS).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control as any}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(PROPERTY_STATUS_LABELS).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="R$ 0,00"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control as any}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva a propriedade..."
                          className="min-h-[100px]"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Características */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-semibold">
                      2
                    </span>
                  </div>
                  Características
                </CardTitle>
                <CardDescription>
                  Detalhes específicos da propriedade como quartos, banheiros e
                  área
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control as any}
                    name="bedroom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartos *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="3"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="bathroom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banheiros *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="parking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vagas *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área (m²) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="120.5"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-semibold">
                      3
                    </span>
                  </div>
                  Endereço
                </CardTitle>
                <CardDescription>
                  Digite o CEP para preenchimento automático dos campos de
                  endereço. Você precisará informar apenas o número da
                  propriedade.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control as any}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP *</FormLabel>
                      <FormControl>
                        <CepInput
                          placeholder="00000-000"
                          value={field.value ?? ""}
                          onChange={(value) => field.onChange(value)}
                          onAddressFound={handleAddressFound}
                          viaCep={viaCep}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control as any}
                    name="address.number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="address.district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Bairro * (preenchido automaticamente)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Centro"
                            {...field}
                            value={field.value ?? ""}
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control as any}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cidade * (preenchida automaticamente)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="São Paulo"
                            {...field}
                            value={field.value ?? ""}
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Estado * (preenchido automaticamente)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SP"
                            {...field}
                            value={field.value ?? ""}
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control as any}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua * (preenchida automaticamente)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua das Flores"
                          {...field}
                          value={field.value ?? ""}
                          disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Características Especiais */}
            <PropertyFeatures features={features} onChange={setFeatures} />

            {/* Proprietário */}
            <PropertyOwner ownerId={ownerId} onChange={setOwnerId} />

            {/* Mídias */}
            <PropertyMediaUpload
              media={media}
              onMediaChange={setMedia}
              propertyId={isEditMode ? propertyId : undefined}
              onUploadFiles={!isEditMode ? handleUploadFiles : undefined}
            />

            {/* Botões de ação */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/properties")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Atualizando..." : "Criando..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Atualizar Propriedade" : "Criar Propriedade"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
