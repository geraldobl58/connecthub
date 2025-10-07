"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { columns } from "./columns";
import { useOwners } from "@/hooks/use-owners";
import { OwnerResponse, OwnerListParams } from "@/types/owners";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { OwnersSearch } from "./owners-search";
import { OwnerFormDialog } from "./owner-form-dialog";

export const OwnersList = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [editingOwner, setEditingOwner] = useState<OwnerResponse | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [filters, setFilters] = useState<OwnerListParams>({
    page: 1,
    limit: 20,
  });

  const { data: ownersData, isLoading, error, refetch } = useOwners(filters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCloseFormDialog = () => {
    setEditingOwner(null);
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

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSearchChange = (searchParams: OwnerListParams) => {
    setFilters((prev) => ({ ...searchParams, page: 1 }));
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} text="Carregando..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erro ao carregar proprietários</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const owners = ownersData?.data || [];
  const meta = ownersData?.meta;

  return (
    <div className="space-y-6">
      <OwnersSearch
        onSearchChange={handleSearchChange}
        onSearchSuccess={handleSearchSuccess}
      />

      <DataTable
        columns={columns}
        data={owners}
        isLoading={isLoading}
        emptyMessage="Nenhum proprietário encontrado"
      />

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleLimitChange}
        />
      )}

      <OwnerFormDialog
        isOpen={isFormDialogOpen}
        onClose={handleCloseFormDialog}
        mode="edit"
        owner={editingOwner}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
