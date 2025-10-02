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
import { Switch } from "@/components/ui/switch";
import {
  createUserFormSchema,
  updateUserSchema,
  CreateUserFormValues,
  UpdateUserValues,
} from "@/schemas/user";
import { UserResponse } from "@/types/users";
import { Role } from "@/types/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { useAuth } from "@/hooks/auth";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  user?: UserResponse;
  onSuccess?: () => void;
}

export function UsersFormDialog({
  isOpen,
  onClose,
  mode = "create",
  user,
  onSuccess,
}: FormDialogProps) {
  const { user: currentUser } = useAuth();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const isEditMode = mode === "edit" && user;

  const form = useForm<CreateUserFormValues | UpdateUserValues>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "AGENT",
      isActive: user?.isActive ?? true,
    },
  });

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "AGENT",
        isActive: user?.isActive ?? true,
      });
    }
  }, [isOpen, user, form]);

  const onSubmit = async (data: CreateUserFormValues | UpdateUserValues) => {
    try {
      if (isEditMode && user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          userData: {
            name: data.name,
            email: data.email,
            role: data.role as Role,
            isActive: data.isActive,
          },
        });
      } else {
        // Criar novo usuário com dados do formulário
        const createData = data as CreateUserFormValues;

        await createUserMutation.mutateAsync({
          tenantId: currentUser?.tenantId || "default",
          name: createData.name,
          email: createData.email,
          password: createData.password,
          role: createData.role as Role,
          isActive: createData.isActive ?? true,
        });
      }
      onClose();
      onSuccess?.();
    } catch (error: unknown) {
      interface ErrorResponse {
        response?: {
          status?: number;
          data?: {
            message?: string;
          };
        };
      }
      const axiosError = error as ErrorResponse;
      if (axiosError?.response?.status === 403) {
        alert("Erro: Apenas administradores podem criar usuários");
      } else if (axiosError?.response?.status === 409) {
        alert(
          `Erro: ${axiosError?.response?.data?.message || "Email já está em uso"}`
        );
      } else {
        alert("Erro ao salvar usuário. Verifique os dados e tente novamente.");
      }
    }
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuário" : "Criar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edite as informações do usuário."
              : "Crie um novo usuário para o sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite o email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo de senha só aparece no modo de criação */}
            {!isEditMode && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a senha"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 6 caracteres com maiúscula, minúscula, número e
                      símbolo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="MANAGER">Gerente</SelectItem>
                      <SelectItem value="AGENT">Agente</SelectItem>
                      <SelectItem value="VIEWER">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status</FormLabel>
                    <FormDescription>
                      Determine se o usuário está ativo no sistema
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
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
