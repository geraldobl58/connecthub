"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DynamicDataTablePaginationProps {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
}

export function DynamicDataTablePagination({
  total,
  page,
  pageSize,
  hasNextPage,
  hasPrevPage,
  limit,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: DynamicDataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            Mostrando <span className="font-medium">{pageSize}</span> de{" "}
            <span className="font-medium">{total}</span> resultados
          </>
        ) : (
          "Nenhum resultado encontrado"
        )}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Itens por página</p>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
            disabled={isLoading}
            className="h-8 w-[70px] rounded border border-input bg-background px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {page}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange?.(page - 1)}
            disabled={!hasPrevPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange?.(page + 1)}
            disabled={!hasNextPage || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
