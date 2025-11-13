"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, MoreVertical, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteClient } from "@/features/clients/hooks/useClients";
import { ClientResponse } from "../schemas/client";

interface ClientActionsProps {
  client: ClientResponse;
}

export function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter();
  const { mutate: deleteClient, isPending } = useDeleteClient();

  const handleEdit = () => {
    router.push(`/dashboard/clients/${client.id}`);
  };

  const handleView = () => {
    router.push(`/dashboard/clients/${client.id}/view`);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja deletar ${client.name}?`)) {
      deleteClient(client.id, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("Cliente deletado com sucesso!");
          } else {
            toast.error(response.message || "Erro ao deletar cliente");
          }
        },
        onError: () => {
          toast.error("Erro ao deletar cliente");
        },
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
