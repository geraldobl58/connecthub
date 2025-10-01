"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { columns } from "./columns";
import { useUsers } from "@/hooks/use-users";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { UsersSearch } from "./users-search";

export const UsersList = () => {
  const [isMounted, setIsMounted] = useState(false);
  const filters = useUrlFilters();
  const { users, meta, isLoading, error, refetch } = useUsers(filters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDeleteSuccess = () => {
    refetch();
  };

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando...</p>
          </div>
        </div>
      ) : isLoading ? (
        // Estado de loading após hidratação
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando usuários...</p>
          </div>
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
          <UsersSearch />
          <DataTable
            columns={columns}
            data={users}
            emptyMessage="Nenhum usuário encontrado."
            meta={{ onDeleteSuccess: handleDeleteSuccess }}
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
