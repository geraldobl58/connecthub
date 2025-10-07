"use client";

import { useEffect } from "react";
import { StageResponse } from "@/types/stages";
import { useCreateStage, useUpdateStage } from "@/hooks/use-stages";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface StagesFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stage?: StageResponse | null;
  onSuccess: () => void;
}

export const StagesFormDialog = ({
  isOpen,
  onClose,
  stage,
  onSuccess,
}: StagesFormDialogProps) => {
  const createStageMutation = useCreateStage();
  const updateStageMutation = useUpdateStage();

  const isEditing = !!stage;

  const form = useForm({
    defaultValues: {
      name: "",
      type: "SALES" as "SALES" | "SUPPORT",
      color: "#3B82F6",
    },
  });

  useEffect(() => {
    if (stage && isEditing) {
      form.reset({
        name: stage.name,
        type: stage.type,
        color: stage.color || "#3B82F6",
      });
    } else if (!isEditing) {
      form.reset({
        name: "",
        type: "SALES" as const,
        color: "#3B82F6",
      });
    }
  }, [stage, isEditing, isOpen, form]);

  const handleSubmit = async (values: {
    name: string;
    type: "SALES" | "SUPPORT";
    color: string;
  }) => {
    try {
      if (isEditing && stage) {
        await updateStageMutation.mutateAsync({
          id: stage.id,
          stageData: values,
        });
        toast.success("Stage atualizado com sucesso!");
      } else {
        await createStageMutation.mutateAsync(values);
        toast.success("Stage criado com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar stage", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading =
    createStageMutation.isPending || updateStageMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Stage" : "Criar Novo Stage"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do stage."
              : "Preencha as informações para criar um novo stage."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Novo Lead, Qualificado, Proposta..."
                      {...field}
                    />
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
                      <SelectItem value="SALES">Vendas</SelectItem>
                      <SelectItem value="SUPPORT">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={field.value}
                        onChange={field.onChange}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Selecione uma cor para identificar o stage visualmente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    Salvando...
                  </>
                ) : isEditing ? (
                  "Atualizar"
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
