"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicDataTable } from "@/components/dynamic-data-table";
import {
  ContractResponse,
  ContractsQueryParams,
  useContracts,
} from "@/features/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateContractModal } from "./create-contract-modal";

export const contractsColumns: ColumnDef<ContractResponse>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "identifier",
    header: "Identificador",
    cell: ({ row }) => <div>{row.original.identifier}</div>,
  },
  {
    accessorKey: "clients.name",
    header: "Cliente",
    cell: ({ row }) => <div>{row.original.clients?.name || "-"}</div>,
  },
  {
    accessorKey: "initialEffectiveDate",
    header: "Data Inicial",
    cell: ({ row }) => (
      <div>
        {new Date(row.original.initialEffectiveDate).toLocaleDateString(
          "pt-BR"
        )}
      </div>
    ),
  },
  {
    accessorKey: "finalEffectiveDate",
    header: "Data Final",
    cell: ({ row }) => (
      <div>
        {new Date(row.original.finalEffectiveDate).toLocaleDateString("pt-BR")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleDateString("pt-BR")}</div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Editar
        </Button>
        <Button variant="destructive" size="sm">
          Deletar
        </Button>
      </div>
    ),
  },
];

export function ContractsList() {
  const { register, handleSubmit, reset } = useForm<ContractsQueryParams>({
    defaultValues: {
      search: "",
    },
  });
  const {
    contracts,
    total,
    page,
    limit,
    pageSize,
    hasNextPage,
    hasPrevPage,
    isLoading,
    handlePageChange,
    handleLimitChange,
    handleSearch,
  } = useContracts();

  const onSubmit = (data: ContractsQueryParams) => {
    if (data.search) {
      handleSearch(data.search);
    }
  };

  const resetForm = () => {
    reset();
    handleSearch("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar contrato por título, identificador ou cliente..."
            disabled={isLoading}
            className="max-w-md"
            {...register("search")}
          />

          <Button type="submit" disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" /> Buscar
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={resetForm}
          >
            <X className="w-4 h-4 mr-2" /> Limpar
          </Button>
        </form>

        <CreateContractModal />
      </div>

      <DynamicDataTable
        columns={contractsColumns}
        data={contracts}
        total={total}
        page={page}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        limit={limit}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
