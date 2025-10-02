"use client";

import { ArrowUpDown } from "lucide-react";
import { formatTableDate } from "@/lib/date-utils";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { UserResponse } from "@/types/users";
import { UsersActions } from "./users-actions";

interface TableMeta {
  onDeleteSuccess?: () => void;
}

export const columns: ColumnDef<UserResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Cargo",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("role") === "ADMIN" ? (
          <div className="text-red-500">Administrador</div>
        ) : row.getValue("role") === "MANAGER" ? (
          <div className="text-blue-500">Gerente</div>
        ) : row.getValue("role") === "AGENT" ? (
          <div className="text-green-500">Agente</div>
        ) : (
          <div className="text-gray-500">Visualizador</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex items-center space-x-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-sm ${isActive ? "text-green-700" : "text-red-700"}`}
          >
            {isActive ? "Ativo" : "Inativo"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div className="text-sm">{formatTableDate(date)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de atualização
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      return <div className="text-sm">{formatTableDate(date)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original;
      const onSuccess = (table.options.meta as TableMeta)?.onDeleteSuccess;
      return <UsersActions user={user} onSuccess={onSuccess} />;
    },
  },
];
