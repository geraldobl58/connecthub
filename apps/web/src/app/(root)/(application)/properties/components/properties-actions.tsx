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
import { Property } from "@/types/property";
import { MoreHorizontal } from "lucide-react";
import { AlertDialogGeneric } from "@/components/alert-dialog-generic";
import { useDeleteProperty } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

interface PropertiesActionsProps {
  property: Property;
  onSuccess?: () => void;
}

export const PropertiesActions = ({
  property,
  onSuccess,
}: PropertiesActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePropertyMutation = useDeleteProperty();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const isManager = currentUser?.role === "MANAGER";
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin || isManager;
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePropertyMutation.mutateAsync(property.id);
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
          {canEdit && (
            <DropdownMenuItem
              onClick={() => router.push(`/properties/${property.id}`)}
            >
              Editar
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Excluir
            </DropdownMenuItem>
          )}
          {!canEdit && !canDelete && (
            <DropdownMenuItem disabled>
              Apenas administradores e gerentes podem gerenciar propriedades
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Excluir propriedade "${property.title}"?`}
        description={`Tem certeza que deseja excluir a propriedade "${property.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
};
