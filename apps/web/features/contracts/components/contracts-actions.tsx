"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ContractResponse } from "../schemas/contract";
import { useDeleteContract } from "../hooks/useContracts";
import { Button } from "@/components/ui/button";

interface ContractsActionsProps {
  contract: ContractResponse;
}

export const ContractsActions = ({ contract }: ContractsActionsProps) => {
  const router = useRouter();
  const { mutate: deleteContract, isPending } = useDeleteContract();

  const handleEdit = () => {
    router.push(`/dashboard/contracts/${contract.id}`);
  };

  const handleDelete = () => {
    if (
      confirm(`Tem certeza que deseja deletar o contrato ${contract.title}?`)
    ) {
      deleteContract(contract.id, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("Contrato deletado com sucesso!");
          } else {
            toast.error(response.message || "Erro ao deletar contrato");
          }
        },
        onError: () => {
          toast.error("Erro ao deletar contrato");
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
};
