"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
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
import {
  createPropertySchema,
  updatePropertySchema,
  CreatePropertyValues,
  UpdatePropertyValues,
  PropertyType,
  PropertyStatus,
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
} from "@/schemas/property";
import { Property } from "@/types/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PropertyMediaUpload } from "@/components/property-media-upload";
import { PropertyMedia } from "@/types/property";

interface FormDialogProps {
  mode?: "create" | "edit";
  property?: Property;
  onSuccess?: () => void;
}

export function PropertiesForm({
  mode = "create",
  property,
  onSuccess,
}: FormDialogProps) {
  const { user: currentUser } = useAuth();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const isEditMode = mode === "edit" && property;
  const isAdmin = currentUser?.role === "ADMIN";
  const isManager = currentUser?.role === "MANAGER";
  const canEdit = isAdmin || isManager;

  // Estado para gerenciar as imagens
  const [media, setMedia] = useState<PropertyMedia[]>(property?.media || []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(
      isEditMode ? updatePropertySchema : createPropertySchema
    ),
    defaultValues: {
      code: property?.code || "",
      title: property?.title || "",
      description: property?.description || "",
      type: property?.type || PropertyType.HOUSE,
      status: property?.status || PropertyStatus.ACTIVE,
      price: property?.price || undefined,
      bedroom: property?.bedroom || undefined,
      bathroom: property?.bathroom || undefined,
      parking: property?.parking || undefined,
      area: property?.area || undefined,
      address: property?.address
        ? {
            street: property.address.street,
            number: property.address.number,
            district: property.address.district,
            city: property.address.city,
            state: property.address.state,
            zip: property.address.zip,
            lat: property.address.lat,
            lng: property.address.lng,
          }
        : undefined,
      features: property?.features || undefined,
      ownerId: property?.ownerId || undefined,
    },
  });

  const onSubmit = async (
    data: CreatePropertyValues | UpdatePropertyValues
  ) => {
    // Verificar permissões para edição
    if (isEditMode && !canEdit) {
      toast.error("Acesso Negado", {
        description:
          "Apenas administradores e gerentes podem editar propriedades.",
      });
      return;
    }

    try {
      // Adicionar media aos dados
      const dataWithMedia = {
        ...data,
        media: media.map((item) => ({
          url: item.url,
          alt: item.alt,
          isCover: item.isCover,
          order: item.order,
        })),
      };

      if (isEditMode && property) {
        await updatePropertyMutation.mutateAsync({
          id: property.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: dataWithMedia as any,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createPropertyMutation.mutateAsync(dataWithMedia as any);
      }

      onSuccess?.();
    } catch {
      // Erro já tratado pelo hook
    }
  };

  const isLoading =
    createPropertyMutation.isPending || updatePropertyMutation.isPending;

  // Verificar se deve mostrar o diálogo
  if (isEditMode && !canEdit) {
    return null;
  }

  return (
    <div>
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Dados principais da propriedade como código, título e descrição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="PROP001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Casa de 3 quartos no centro"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a propriedade..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="450000.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
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
                  control={form.control}
                  name="bedroom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathroom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="120.5"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Localização completa da propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua das Flores, 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="01234-567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagens */}
          <PropertyMediaUpload
            media={media}
            onMediaChange={setMedia}
            maxFiles={10}
          />

          {/* Botões de Ação */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center min-w-[120px]"
                >
                  {isLoading ? (
                    <LoadingSpinner size={14} text="Salvando..." />
                  ) : (
                    "Salvar Propriedade"
                  )}
                </Button>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
