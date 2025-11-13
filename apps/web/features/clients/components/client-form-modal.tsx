"use client";

import { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientForm } from "./client-form";
import {
  useCreateClient,
  useUpdateClient,
} from "@/features/clients/hooks/useClients";
import {
  type ClientResponse,
  type CreateClient,
} from "@/features/clients/schemas/client";

interface ClientFormModalProps {
  client?: ClientResponse;
  trigger?: "button" | "icon";
}

export function ClientFormModal({
  client,
  trigger = "button",
}: ClientFormModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!client;

  const handleSubmit = (data: CreateClient) => {
    if (isEditMode) {
      updateClient(
        { id: client.id, data },
        {
          onSuccess: () => setOpen(false),
        }
      );
    } else {
      createClient(data, {
        onSuccess: () => setOpen(false),
      });
    }
  };

  const triggerButton =
    trigger === "icon" ? (
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-start"
      >
        <Edit2 className="w-4 h-4" />
        Editar
      </Button>
    ) : (
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Novo Cliente
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Atualize os dados do cliente ${client?.name}`
              : "Preencha os dados para criar um novo cliente"}
          </DialogDescription>
        </DialogHeader>

        <ClientForm
          isSubmitting={isLoading}
          onSubmit={handleSubmit}
          defaultValues={client}
          submitLabel={isEditMode ? "Atualizar" : "Salvar"}
        />
      </DialogContent>
    </Dialog>
  );
}
