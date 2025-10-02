"use client";

import { useCallback, useEffect, useState } from "react";
import { useProperties } from "@/hooks/use-properties";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { PropertiesSearch } from "./properties-search";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Pagination } from "@/components/pagination";

export const PropertiesList = () => {
  const [isMounted, setIsMounted] = useState(false);

  const filters = useUrlFilters();
  const { properties, meta, isLoading, error, refetch } =
    useProperties(filters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Propriedades</h1>
        <p className="text-gray-500 mt-1">
          Gerencie as propriedades do sistema
        </p>
      </div>
      {!isMounted ? (
        // Estado inicial durante hidratação
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size={32} text="Carregando..." />
        </div>
      ) : isLoading ? (
        // Estado de loading após hidratação
        <div className="space-y-4">
          <PropertiesSearch onSearchSuccess={handleSearchSuccess} />

          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size={24} text="Carregando propriedades..." />
            </div>
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
        <>
          <PropertiesSearch onSearchSuccess={handleSearchSuccess} />

          <DataTable
            columns={columns}
            data={properties}
            emptyMessage="Nenhum propriedade encontrada."
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
