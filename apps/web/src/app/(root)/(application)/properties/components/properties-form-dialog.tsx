"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect } from "react";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  property?: Property;
  onSuccess?: () => void;
}

export function PropertiesFormDialog({
  isOpen,
  onClose,
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

  const form = useForm<CreatePropertyValues | UpdatePropertyValues>({
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
            neighborhood: property.address.neighborhood,
            city: property.address.city,
            state: property.address.state,
            zipCode: property.address.zipCode,
            country: property.address.country,
          }
        : undefined,
      features: property?.features || undefined,
      ownerId: property?.ownerId || undefined,
    },
  });

  // Reset form when property changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
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
              neighborhood: property.address.neighborhood,
              city: property.address.city,
              state: property.address.state,
              zipCode: property.address.zipCode,
              country: property.address.country,
            }
          : undefined,
        features: property?.features || undefined,
        ownerId: property?.ownerId || undefined,
      });
    }
  }, [isOpen, property, form]);

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
      if (isEditMode && property) {
        await updatePropertyMutation.mutateAsync({
          id: property.id,
          data: data as any,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createPropertyMutation.mutateAsync(data as any);
      }

      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Propriedade" : "Criar Propriedade"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite as informações da propriedade."
              : "Crie uma nova propriedade no sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Características</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>

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
                  name="address.neighborhood"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="address.zipCode"
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

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Brasil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                {isLoading ? (
                  <LoadingSpinner size={14} text="Salvando..." />
                ) : (
                  "Salvar"
                )}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
