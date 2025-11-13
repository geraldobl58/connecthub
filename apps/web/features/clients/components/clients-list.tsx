"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useClients } from "@/features/clients";

import { DynamicDataTable } from "@/components/dynamic-data-table";
import { Button } from "@/components/ui/button";

import { clientsColumns } from "./columns";
import { ClientsFilter } from "./clients-filter";

export function ClientsList() {
  const searchParams = useSearchParams();
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
    queryParams,
  } = useClients({ page, limit, search });

  // Sincronizar mudanças de parâmetros com URL
  useEffect(() => {
    const params = new URLSearchParams();

    // Sempre incluir page se > 1
    if (queryParams.page && queryParams.page > 1) {
      params.append("page", String(queryParams.page));
    }

    // Sempre incluir limit se diferente do padrão (10)
    if (queryParams.limit && queryParams.limit !== 10) {
      params.append("limit", String(queryParams.limit));
    }

    // Incluir search se existir
    if (queryParams.search && queryParams.search.trim()) {
      params.append("search", queryParams.search);
    }

    const queryString = params.toString();

    const newUrl = queryString
      ? `/dashboard/clients?${queryString}`
      : "/dashboard/clients";
    const currentUrl = window.location.pathname + window.location.search;

    // Apenas atualiza se a URL realmente mudou
    if (newUrl !== currentUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [queryParams, router]);

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
        <Button variant="link">
          <Link
            href="/dashboard/clients/new"
            className="flex items-center gap-2"
          >
            <Plus className="size-4" />
            Novo Cliente
          </Link>
        </Button>
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
