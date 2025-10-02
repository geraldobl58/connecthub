"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { columns } from "./columns";
import { useUsers } from "@/hooks/use-users";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { UsersSearch } from "./users-search";
import { UsersBulkActions } from "./users-bulk-actions";
import { UserResponse } from "@/types/users";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export const UsersList = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);
  const filters = useUrlFilters();
  const { users, meta, isLoading, error, refetch } = useUsers(filters);
  const usersLengthRef = useRef(users?.length || 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Limpar seleção quando a lista de usuários mudar (baseado no comprimento)
  useEffect(() => {
    if (users && users.length !== usersLengthRef.current) {
      setSelectedUsers([]);
      usersLengthRef.current = users.length;
    }
  }, [users?.length]);

  const handleSelectionChange = useCallback((selectedRows: UserResponse[]) => {
    setSelectedUsers(selectedRows);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    setSelectedUsers([]);
    refetch();
  }, [refetch]);

  const handleSearchSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  // Sempre renderizar a estrutura base para evitar hydration mismatch
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-500 mt-1">Gerencie os usuários do sistema</p>
      </div>

      {!isMounted ? (
        // Estado inicial durante hidratação
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size={32} text="Carregando..." />
        </div>
      ) : isLoading ? (
        // Estado de loading após hidratação
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size={32} text="Carregando usuários..." />
        </div>
      ) : error ? (
        // Estado de erro
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar usuários</p>
            <p className="text-gray-500 text-sm mt-1">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      ) : (
        // Estado de sucesso
        <>
          <UsersSearch onSearchSuccess={handleSearchSuccess} />
          <UsersBulkActions
            selectedUsers={selectedUsers}
            onSuccess={handleDeleteSuccess}
          />
          <DataTable
            columns={columns}
            data={users}
            emptyMessage="Nenhum usuário encontrado."
            meta={{ onDeleteSuccess: handleDeleteSuccess }}
            onSelectionChange={handleSelectionChange}
          />
          {meta && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              itemsPerPage={meta.limit}
            />
          )}
        </>
      )}
    </div>
  );
};
