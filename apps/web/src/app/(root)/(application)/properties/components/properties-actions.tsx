"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PropertyResponse } from "@/types/properties";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { AlertDialogGeneric } from "@/components/alert-dialog-generic";
import { useDeleteProperty } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface PropertiesActionsProps {
  property: PropertyResponse;
  onDeleteSuccess?: () => void;
}

export const PropertiesActions = ({
  property,
  onDeleteSuccess,
}: PropertiesActionsProps) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deletePropertyMutation = useDeleteProperty();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleDelete = async () => {
    try {
      await deletePropertyMutation.mutateAsync(property.id);
      setIsDeleteDialogOpen(false);
      onDeleteSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEdit = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem editar propriedades.",
      });
      return;
    }
    router.push(`/properties/${property.id}/edit`);
  };

  const handleViewDetails = () => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit} disabled={!isAdmin}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={!isAdmin || deletePropertyMutation.isPending}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Deletar Propriedade"
        description={`Tem certeza que deseja deletar a propriedade "${property.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        isLoading={deletePropertyMutation.isPending}
      />
    </>
  );
};
