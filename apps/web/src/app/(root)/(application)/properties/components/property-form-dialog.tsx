"use client";

import { useEffect } from "react";
import { PropertyResponse } from "@/types/properties";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { useOwners } from "@/hooks/use-owners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  createPropertyFormSchema,
  updatePropertySchema,
  CreatePropertyFormValues,
  UpdatePropertyValues,
} from "@/schemas/property";
import { Plus, Edit } from "lucide-react";

interface PropertyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  property?: PropertyResponse | null;
  onSuccess: () => void;
}

export const PropertyFormDialog = ({
  isOpen,
  onClose,
  mode = "create",
  property,
  onSuccess,
}: PropertyFormDialogProps) => {
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const isEditMode = mode === "edit" && property;

  const { data: ownersData } = useOwners();

  const form = useForm<CreatePropertyFormValues | UpdatePropertyValues>({
    resolver: zodResolver(
      isEditMode ? updatePropertySchema : createPropertyFormSchema
    ),
    defaultValues: {
      code: property?.code || "",
      title: property?.title || "",
      description: property?.description || "",
      type: property?.type || "HOUSE",
      status: property?.status || "ACTIVE",
      price: property?.price || undefined,
      minPrice: property?.minPrice || undefined,
      maxPrice: property?.maxPrice || undefined,
      bedroom: property?.bedroom || undefined,
      bathroom: property?.bathroom || undefined,
      parking: property?.parking || undefined,
      area: property?.area || undefined,
      ownerId: property?.ownerId || "none",
      address: property?.address || {
        street: "",
        number: "",
        district: "",
        city: "",
        state: "",
        zip: "",
      },
      features: property?.features || {},
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        code: property?.code || "",
        title: property?.title || "",
        description: property?.description || "",
        type: property?.type || "HOUSE",
        status: property?.status || "ACTIVE",
        price: property?.price || undefined,
        minPrice: property?.minPrice || undefined,
        maxPrice: property?.maxPrice || undefined,
        bedroom: property?.bedroom || undefined,
        bathroom: property?.bathroom || undefined,
        parking: property?.parking || undefined,
        area: property?.area || undefined,
        ownerId: property?.ownerId || "none",
        address: property?.address || {
          street: "",
          number: "",
          district: "",
          city: "",
          state: "",
          zip: "",
        },
        features: property?.features || {},
      });
    }
  }, [isOpen, property, form]);

  const onSubmit = async (
    data: CreatePropertyFormValues | UpdatePropertyValues
  ) => {
    try {
      // Tratar ownerId "none" como undefined
      const processedData = {
        ...data,
        ownerId: data.ownerId === "none" ? undefined : data.ownerId,
      };

      if (isEditMode && property) {
        await updatePropertyMutation.mutateAsync({
          id: property.id,
          data: processedData as UpdatePropertyValues,
        });
      } else {
        await createPropertyMutation.mutateAsync(
          processedData as CreatePropertyFormValues
        );
      }
      form.reset();
      onSuccess();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading =
    createPropertyMutation.isPending || updatePropertyMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit className="h-5 w-5" />
                Editar Propriedade
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Criar Propriedade
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações da propriedade."
              : "Preencha os dados para criar uma nova propriedade."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PROP001"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Casa com 3 quartos em São Paulo"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição detalhada da propriedade..."
                        className="min-h-[100px]"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HOUSE">Casa</SelectItem>
                          <SelectItem value="APARTMENT">Apartamento</SelectItem>
                          <SelectItem value="CONDO">Cobertura</SelectItem>
                          <SelectItem value="LAND">Terreno</SelectItem>
                          <SelectItem value="COMMERCIAL">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Ativo</SelectItem>
                          <SelectItem value="INACTIVE">Inativo</SelectItem>
                          <SelectItem value="RESERVED">Reservado</SelectItem>
                          <SelectItem value="SOLD">Vendido</SelectItem>
                          <SelectItem value="RENTED">Alugado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Preços */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preços</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Mínimo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="400000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Máximo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="600000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
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
              <h3 className="text-lg font-semibold">Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
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
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
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
                          placeholder="2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m²)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="120.5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Proprietário */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Proprietário</h3>
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proprietário</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o proprietário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Sem proprietário</SelectItem>
                        {ownersData?.data?.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua das Flores"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Centro"
                          {...field}
                          disabled={isLoading}
                        />
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
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="São Paulo"
                          {...field}
                          disabled={isLoading}
                        />
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
                      <FormLabel>Estado *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SP"
                          maxLength={2}
                          {...field}
                          disabled={isLoading}
                        />
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
                        <Input
                          placeholder="01234-567"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoadingSpinner size={16} className="mr-2" />}
                {isEditMode ? "Atualizar" : "Criar"} Propriedade
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
