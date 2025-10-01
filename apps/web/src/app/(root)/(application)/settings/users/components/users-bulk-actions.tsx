"use client";

import { useState } from "react";
import { UserResponse } from "@/types/users";
import { Button } from "@/components/ui/button";
import { AlertDialogGeneric } from "@/components/alert-dialog-generic";
import { useDeleteUser } from "@/hooks/use-users";
import { AlertCircleIcon, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UsersBulkActionsProps {
  selectedUsers: UserResponse[];
  onSuccess?: () => void;
}

export const UsersBulkActions = ({
  selectedUsers,
  onSuccess,
}: UsersBulkActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Excluir usuários em paralelo
      await Promise.all(
        selectedUsers.map((user) => deleteUserMutation.mutateAsync(user.id))
      );

      setIsDeleteDialogOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao excluir usuários em lote:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  const isMultiple = selectedUsers.length > 1;
  const title = isMultiple
    ? `Excluir ${selectedUsers.length} usuários?`
    : `Excluir usuário "${selectedUsers[0].name}"?`;

  const description = isMultiple
    ? `Tem certeza que deseja excluir ${selectedUsers.length} usuários selecionados? Esta ação não pode ser desfeita.`
    : `Tem certeza que deseja excluir o usuário "${selectedUsers[0].name}"? Esta ação não pode ser desfeita.`;

  return (
    <div>
      <div className="flex-1">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            <p>{description}</p>
            <p>
              {selectedUsers.length} usuário
              {selectedUsers.length > 1 ? "s" : ""} selecionado
              {selectedUsers.length > 1 ? "s" : ""}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={title}
        description={description}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};
