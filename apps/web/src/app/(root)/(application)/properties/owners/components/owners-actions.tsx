"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OwnerResponse } from "@/types/owners";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { AlertDialogGeneric } from "@/components/alert-dialog-generic";
import { useDeleteOwner } from "@/hooks/use-owners";
import { OwnerFormDialog } from "./owner-form-dialog";
import { OwnerDetailDialog } from "./owner-detail-dialog";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface OwnersActionsProps {
  owner: OwnerResponse;
  onDeleteSuccess?: () => void;
}

export const OwnersActions = ({
  owner,
  onDeleteSuccess,
}: OwnersActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const deleteOwnerMutation = useDeleteOwner();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleDelete = async () => {
    try {
      await deleteOwnerMutation.mutateAsync(owner.id);
      setIsDeleteDialogOpen(false);
      onDeleteSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEdit = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem editar proprietários.",
      });
      return;
    }
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = () => {
    setIsDetailDialogOpen(true);
  };

  const handleSuccess = () => {
    onDeleteSuccess?.();
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
            disabled={!isAdmin || deleteOwnerMutation.isPending}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OwnerDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        owner={owner}
      />

      <OwnerFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        mode="edit"
        owner={owner}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          handleSuccess();
        }}
      />

      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Deletar Proprietário"
        description={`Tem certeza que deseja deletar o proprietário "${owner.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteOwnerMutation.isPending}
      />
    </>
  );
};
