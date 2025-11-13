import { ColumnDef } from "@tanstack/react-table";

import { ContractResponse } from "../schemas/contract";
import { ContractsActions } from "./contracts-actions";

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
    cell: ({ row }) => <ContractsActions contract={row.original} />,
  },
];
