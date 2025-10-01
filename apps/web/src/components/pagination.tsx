"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUrlManager } from "@/hooks/use-url-manager";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const { updatePage, updateLimit } = useUrlManager();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground text-sm">
        {totalItems > 0 ? (
          <>
            Mostrando {startItem} a {endItem} de {totalItems} resultado(s)
          </>
        ) : (
          "Nenhum resultado encontrado"
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Itens por página:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => updateLimit(Number(e.target.value))}
            className="h-8 w-16 rounded border border-input bg-background px-2 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
