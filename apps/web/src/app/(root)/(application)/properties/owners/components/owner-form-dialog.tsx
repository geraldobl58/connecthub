"use client";

import { useEffect } from "react";
import { OwnerResponse } from "@/types/owners";
import { useCreateOwner, useUpdateOwner } from "@/hooks/use-owners";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  createOwnerFormSchema,
  updateOwnerSchema,
  CreateOwnerFormValues,
  UpdateOwnerValues,
} from "@/schemas/owner";
import { Plus, Edit } from "lucide-react";

interface OwnerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  owner?: OwnerResponse | null;
  onSuccess: () => void;
}

export const OwnerFormDialog = ({
  isOpen,
  onClose,
  mode = "create",
  owner,
  onSuccess,
}: OwnerFormDialogProps) => {
  const createOwnerMutation = useCreateOwner();
  const updateOwnerMutation = useUpdateOwner();
  const isEditMode = mode === "edit" && owner;

  const form = useForm<CreateOwnerFormValues | UpdateOwnerValues>({
    resolver: zodResolver(
      isEditMode ? updateOwnerSchema : createOwnerFormSchema
    ),
    defaultValues: {
      name: owner?.name || "",
      phone: owner?.phone || "",
      email: owner?.email || "",
      notes: owner?.notes || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: owner?.name || "",
        phone: owner?.phone || "",
        email: owner?.email || "",
        notes: owner?.notes || "",
      });
    }
  }, [isOpen, owner, form]);

  const onSubmit = async (data: CreateOwnerFormValues | UpdateOwnerValues) => {
    try {
      if (isEditMode && owner) {
        await updateOwnerMutation.mutateAsync({
          id: owner.id,
          data: data as UpdateOwnerValues,
        });
      } else {
        await createOwnerMutation.mutateAsync(data as CreateOwnerFormValues);
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
    createOwnerMutation.isPending || updateOwnerMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit className="h-5 w-5" />
                Editar Proprietário
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Criar Proprietário
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações do proprietário."
              : "Preencha os dados para criar um novo proprietário."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome completo do proprietário"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(11) 99999-9999"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="proprietario@email.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Email para contato com o proprietário
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o proprietário..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Informações adicionais sobre o proprietário
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditMode ? "Atualizar" : "Criar"} Proprietário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
