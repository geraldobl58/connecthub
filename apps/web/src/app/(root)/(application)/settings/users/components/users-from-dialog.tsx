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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createUserSchema, UserValues } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsersFormDialog({ isOpen, onClose }: FormDialogProps) {
  const form = useForm<UserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "AGENT",
    },
  });

  const onSubmit = (data: UserValues) => {
    console.log(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Criar Usuário</DialogTitle>
              <DialogDescription>
                Crie um novo usuário para o sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input type="password" id="password" name="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="role">Cargo</Label>
                <Select name="role">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="MANAGER">Gerente</SelectItem>
                    <SelectItem value="AGENT">Agente</SelectItem>
                    <SelectItem value="VIEWER">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex  items-center gap-2 bg-gray-100 p-4 rounded-md">
                <Label htmlFor="status">Status</Label>
                <Switch id="status" name="status" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Form>
      </form>
    </Dialog>
  );
}
