"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Plus } from "lucide-react";

import { DynamicDataTable } from "@/components/dynamic-data-table";
import { Button } from "@/components/ui/button";
import { contractsColumns } from "./columns";
import { useContracts } from "../hooks/useContracts";
import { ContractsFilter } from "./contracts-filter";
import { Loading } from "@/components/loading";

export function ContractsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || undefined;

  const {
    contracts,
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
  } = useContracts({ page, limit, search });

  useEffect(() => {
    const params = new URLSearchParams();

    if (queryParams.page && queryParams.page > 1) {
      params.append("page", String(queryParams.page));
    }

    if (queryParams.limit && queryParams.limit !== 10) {
      params.append("limit", String(queryParams.limit));
    }

    if (queryParams.search && queryParams.search.trim()) {
      params.append("search", queryParams.search);
    }

    const queryString = params.toString();

    const newUrl = queryString
      ? `/dashboard/contracts?${queryString}`
      : "/dashboard/contracts";

    const currentUrl = window.location.pathname + window.location.search;

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

  if (isLoading) {
    return (
      <Loading
        fullscreen
        color="blue"
        title="Carregando tabela de contratos..."
        message="Aguarde enquanto buscamos suas informações."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between items-center">
        <ContractsFilter onSearch={handleSearch} isLoading={isLoading} />
        <Button variant="link">
          <Link
            href="/dashboard/contracts/new"
            className="flex  items-center gap-2"
          >
            <Plus className="size-4" />
            Novo Contrato
          </Link>
        </Button>
      </div>

      <DynamicDataTable
        columns={contractsColumns}
        data={contracts}
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
