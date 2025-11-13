"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DynamicDataTable } from "@/components/dynamic-data-table";
import { useClients } from "@/features/clients";
import { clientsColumns } from "./columns";
import { ClientsFilter } from "./clients-filter";
import { ClientFormModal } from "./client-form-modal";

export function ClientsList() {
  const searchParams = new URLSearchParams();
  const router = useRouter();

  // Ler parâmetros da URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || undefined;

  const {
    clients,
    total,
    page: currentPage,
    limit: currentLimit,
    pageSize,
    hasNextPage,
    hasPrevPage,
    isLoading,
    handlePageChange,
    handleLimitChange,
    handleSearch,
  } = useClients({ page, limit, search });

  // Sincronizar mudanças de parâmetros com URL
  useEffect(() => {
    const params = new URLSearchParams();

    // Sempre incluir page se > 1
    if (currentPage > 1) {
      params.append("page", String(currentPage));
    }

    // Sempre incluir limit se diferente do padrão (10)
    if (currentLimit !== 10) {
      params.append("limit", String(currentLimit));
    }

    // Incluir search se existir
    if (search && search.trim()) {
      params.append("search", search);
    }

    const queryString = params.toString();
    console.log(queryString);

    const newUrl = queryString
      ? `/dashboard/clients?${queryString}`
      : "/dashboard/clients";
    const currentUrl = window.location.pathname + window.location.search;

    // Apenas atualiza se a URL realmente mudou
    if (newUrl !== currentUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [currentPage, currentLimit, search, router]);

  const handlePageChangeWithScroll = (newPage: number) => {
    handlePageChange(newPage);
  };

  const handleLimitChangeWithScroll = (newLimit: number) => {
    handleLimitChange(newLimit);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between items-center">
        <ClientsFilter onSearch={handleSearch} isLoading={isLoading} />
        <ClientFormModal />
      </div>

      <DynamicDataTable
        columns={clientsColumns}
        data={clients}
        total={total}
        page={currentPage}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        limit={currentLimit}
        isLoading={isLoading}
        onPageChange={handlePageChangeWithScroll}
        onLimitChange={handleLimitChangeWithScroll}
      />
    </div>
  );
}
