"use client";

import { useState } from "react";
import { StageResponse } from "@/types/stages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import { useDeleteStage, useReorderStages } from "@/hooks/use-stages";
import { toast } from "sonner";

interface StagesTableProps {
  stages: StageResponse[];
  onEditStage: (stage: StageResponse) => void;
  onSuccess: () => void;
}

export const StagesTable = ({
  stages,
  onEditStage,
  onSuccess,
}: StagesTableProps) => {
  const [deleteStageId, setDeleteStageId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteStageMutation = useDeleteStage();
  const reorderStagesMutation = useReorderStages();

  const handleDeleteStage = async (id: string) => {
    try {
      await deleteStageMutation.mutateAsync(id);
      toast.success("Stage excluído com sucesso!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao excluir stage", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteStageId(null);
    }
  };

  const handleMoveStage = async (stageId: string, direction: "up" | "down") => {
    const currentIndex = stages.findIndex((stage) => stage.id === stageId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stages.length) return;

    const newStages = [...stages];
    [newStages[currentIndex], newStages[newIndex]] = [
      newStages[newIndex],
      newStages[currentIndex],
    ];

    const stageIds = newStages.map((stage) => stage.id);

    try {
      await reorderStagesMutation.mutateAsync({ stageIds });
      toast.success("Ordem dos stages atualizada!");
      onSuccess();
    } catch (error) {
      toast.error("Erro ao reordenar stages", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  const getStageTypeBadge = (type: string) => {
    switch (type) {
      case "SALES":
        return <Badge variant="default">Vendas</Badge>;
      case "SUPPORT":
        return <Badge variant="secondary">Suporte</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStageStatusBadge = (stage: StageResponse) => {
    if (stage.isWon) {
      return (
        <Badge variant="default" className="bg-green-600">
          Ganho
        </Badge>
      );
    }
    if (stage.isLost) {
      return <Badge variant="destructive">Perdido</Badge>;
    }
    return <Badge variant="outline">Ativo</Badge>;
  };

  if (stages.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <p className="text-gray-500">Nenhum stage encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead className="w-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map((stage, index) => (
              <TableRow key={stage.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{stage.order}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{stage.name}</TableCell>
                <TableCell>{getStageTypeBadge(stage.type)}</TableCell>
                <TableCell>{getStageStatusBadge(stage)}</TableCell>
                <TableCell>
                  {stage.color && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {stage.color}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditStage(stage)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      {index > 0 && (
                        <DropdownMenuItem
                          onClick={() => handleMoveStage(stage.id, "up")}
                        >
                          <ArrowUp className="h-4 w-4 mr-2" />
                          Mover para cima
                        </DropdownMenuItem>
                      )}
                      {index < stages.length - 1 && (
                        <DropdownMenuItem
                          onClick={() => handleMoveStage(stage.id, "down")}
                        >
                          <ArrowDown className="h-4 w-4 mr-2" />
                          Mover para baixo
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setDeleteStageId(stage.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este stage? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStageId && handleDeleteStage(deleteStageId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
