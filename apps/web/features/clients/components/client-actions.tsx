"use client";

import { Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientFormModal } from "./client-form-modal";
import { useDeleteClient } from "@/features/clients/hooks/useClients";
import { ClientResponse } from "../schemas/client";

interface ClientActionsProps {
  client: ClientResponse;
}

export function ClientActions({ client }: ClientActionsProps) {
  const { mutate: deleteClient, isPending } = useDeleteClient();

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja deletar ${client.name}?`)) {
      deleteClient(client.id);
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
        <DropdownMenuItem asChild>
          <ClientFormModal client={client} trigger="icon" />
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
