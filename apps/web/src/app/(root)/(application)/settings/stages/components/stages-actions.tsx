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
import { StageResponse } from "@/types/stages";
import { MoreHorizontal, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { AlertDialogGeneric } from "@/components/alert-dialog-generic";
import { useDeleteStage, useReorderStages } from "@/hooks/use-stages";
import { StagesFormDialog } from "./stages-form-dialog";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface StagesActionsProps {
  stage: StageResponse;
  stages: StageResponse[];
  onSuccess?: () => void;
}

export const StagesActions = ({
  stage,
  stages,
  onSuccess,
}: StagesActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const deleteStageMutation = useDeleteStage();
  const reorderStagesMutation = useReorderStages();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const currentIndex = stages.findIndex((s) => s.id === stage.id);
  const canMoveUp = currentIndex > 0;
  const canMoveDown = currentIndex < stages.length - 1;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStageMutation.mutateAsync(stage.id);
      setIsDeleteDialogOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao excluir stage", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveStage = async (direction: "up" | "down") => {
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stages.length) return;

    const newStages = [...stages];
    [newStages[currentIndex], newStages[newIndex]] = [
      newStages[newIndex],
      newStages[currentIndex],
    ];

    const stageIds = newStages.map((s) => s.id);

    setIsReordering(true);
    try {
      await reorderStagesMutation.mutateAsync({ stageIds });
      toast.success("Ordem dos stages atualizada!");
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao reordenar stages", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsReordering(false);
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
          {isAdmin && (
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
          )}
          {isAdmin && canMoveUp && (
            <DropdownMenuItem
              onClick={() => handleMoveStage("up")}
              disabled={isReordering}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Mover para cima
            </DropdownMenuItem>
          )}
          {isAdmin && canMoveDown && (
            <DropdownMenuItem
              onClick={() => handleMoveStage("down")}
              disabled={isReordering}
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Mover para baixo
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem disabled>
              Apenas administradores podem editar/excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <StagesFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        stage={stage}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          onSuccess?.();
        }}
      />

      <AlertDialogGeneric
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Excluir stage "${stage.name}"?`}
        description={`Tem certeza que deseja excluir o stage "${stage.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
};
