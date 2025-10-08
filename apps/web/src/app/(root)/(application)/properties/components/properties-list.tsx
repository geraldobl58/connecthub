"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { columns } from "./columns";
import { useProperties } from "@/hooks/use-properties";
import { PropertyListParams } from "@/types/properties";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PropertiesSearch } from "./properties-search";

export const PropertiesList = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState<PropertyListParams>({
    page: 1,
    limit: 20,
  });

  const { data: propertiesData, error, refetch } = useProperties(filters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSearchChange = (searchParams: PropertyListParams) => {
    setFilters({ ...searchParams, page: 1 });
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
        <p className="text-red-600 mb-4">Erro ao carregar propriedades</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const properties = propertiesData?.data || [];
  const meta = propertiesData?.meta;

  return (
    <div className="space-y-6">
      <PropertiesSearch
        onSearchChange={handleSearchChange}
        onSearchSuccess={handleSearchSuccess}
      />

      <DataTable
        columns={columns}
        data={properties}
        emptyMessage="Nenhuma propriedade encontrada"
      />

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
};
