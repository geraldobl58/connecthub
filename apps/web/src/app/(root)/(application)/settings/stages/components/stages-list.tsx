"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { columns } from "./columns";
import { useStages } from "@/hooks/use-stages";
import { useStageUrlFilters } from "@/hooks/use-stage-url-filters";
import { useStageUrlManager } from "@/hooks/use-stage-url-manager";
import { StageResponse } from "@/types/stages";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { StagesSearch } from "./stages-search";
import { StagesFormDialog } from "./stages-form-dialog";

export const StagesList = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [editingStage, setEditingStage] = useState<StageResponse | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const filters = useStageUrlFilters();
  const { updatePage, updateLimit } = useStageUrlManager();
  const { stages, meta, isLoading, error, refetch } = useStages(filters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCloseFormDialog = () => {
    setEditingStage(null);
    setIsFormDialogOpen(false);
  };

  const handleFormSuccess = () => {
    refetch();
    handleCloseFormDialog();
  };

  const handleDeleteSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSearchSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} text="Carregando..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <StagesSearch onSearchSuccess={handleSearchSuccess} />
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size={24} text="Carregando stages..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar stages</p>
          <p className="text-gray-500 text-sm mt-1">
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stages</h1>
        <p className="text-gray-500 mt-1">
          Gerencie os estágios do pipeline de vendas
        </p>
      </div>

      <StagesSearch onSearchSuccess={handleSearchSuccess} />

      <DataTable
        columns={columns}
        data={stages}
        emptyMessage="Nenhum stage encontrado."
        meta={{ onDeleteSuccess: handleDeleteSuccess }}
      />

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.limit}
          onPageChange={updatePage}
          onLimitChange={updateLimit}
        />
      )}

      <StagesFormDialog
        isOpen={isFormDialogOpen}
        onClose={handleCloseFormDialog}
        stage={editingStage}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
