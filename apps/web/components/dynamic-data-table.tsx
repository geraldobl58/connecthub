"use client";

import { useState } from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DynamicDataTablePagination } from "./dynamic-data-table-pagination";

interface DynamicDataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  limit?: number;
}

export function DynamicDataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  total,
  page,
  pageSize,
  hasNextPage,
  hasPrevPage,
  isLoading = false,
  onPageChange,
  onLimitChange,
  limit = 20,
}: DynamicDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    rowCount: total,
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data?.length ? (
              data.map((row, idx) => {
                const rowId =
                  (row.id as string) || (row.key as string) || `row-${idx}`;

                return (
                  <TableRow key={rowId}>
                    {columns.map((column, colIdx) => {
                      const cell = table
                        .getRowModel()
                        .rows[idx]?.getVisibleCells()[colIdx] || {
                        getContext: () => ({
                          getValue: () => undefined,
                          row: { index: idx, original: row },
                          column,
                          table,
                        }),
                        id: `${rowId}-${colIdx}`,
                      };

                      return (
                        <TableCell key={`${rowId}-${colIdx}`}>
                          {flexRender(
                            column.cell,
                            cell.getContext?.() || {
                              getValue: () => undefined,
                              row: { index: idx, original: row },
                              column,
                              table,
                            }
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem dados para exibir.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <DynamicDataTablePagination
          total={total}
          page={page}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
