"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserResponse } from "@/types/users";
import { MoreHorizontal } from "lucide-react";
import { AlertDialogGeneric } from "@/components/alert-dialog-generic";
import { useDeleteUser } from "@/hooks/use-users";
import { UsersFormDialog } from "./users-form-dialog";
import { useAuth } from "@/hooks/auth";

interface UsersActionsProps {
  user: UserResponse;
  onSuccess?: () => void;
}

export const UsersActions = ({ user, onSuccess }: UsersActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteUserMutation = useDeleteUser();
  const { user: currentUser } = useAuth();
  const isCurrentUser = user.id === currentUser?.id;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserMutation.mutateAsync(user.id);
      setIsDeleteDialogOpen(false);
      onSuccess?.();
    } catch {
      // Erro tratado silenciosamente
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Editar
          </DropdownMenuItem>
          {!isCurrentUser && (
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UsersFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        mode="edit"
        user={user}
        onSuccess={onSuccess}
      />

      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Excluir usuário "${user.name}"?`}
        description={`Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
};
