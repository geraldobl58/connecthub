"use client";

import { ArrowUpDown, Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OwnerResponse } from "@/types/owners";
import { OwnersActions } from "./owners-actions";

interface TableMeta {
  onDeleteSuccess?: () => void;
}

export const columns: ColumnDef<OwnerResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Proprietário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const owner = row.original;
      return (
        <div className="min-w-[200px] max-w-[300px] space-y-1">
          <div className="font-semibold text-gray-900">{owner.name}</div>
          {owner.notes && (
            <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {owner.notes}
            </div>
          )}
        </div>
      );
    },
    size: 300,
    minSize: 200,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      if (!email) {
        return <div className="text-gray-400 text-sm">Não informado</div>;
      }
      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700 truncate">{email}</span>
        </div>
      );
    },
    size: 250,
    minSize: 200,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Telefone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      if (!phone) {
        return <div className="text-gray-400 text-sm">Não informado</div>;
      }
      return (
        <div className="flex items-center gap-2 min-w-[150px]">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">{phone}</span>
        </div>
      );
    },
    size: 180,
    minSize: 150,
  },
  {
    accessorKey: "_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Propriedades
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("_count") as
        | { properties: number }
        | undefined;
      const propertiesCount = count?.properties || 0;

      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Building className="h-4 w-4 text-gray-400" />
          <Badge variant={propertiesCount > 0 ? "default" : "secondary"}>
            {propertiesCount}{" "}
            {propertiesCount === 1 ? "propriedade" : "propriedades"}
          </Badge>
        </div>
      );
    },
    size: 150,
    minSize: 120,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const owner = row.original;
      const meta = table.options.meta as TableMeta;

      return (
        <OwnersActions owner={owner} onDeleteSuccess={meta?.onDeleteSuccess} />
      );
    },
    size: 100,
    minSize: 80,
  },
];
