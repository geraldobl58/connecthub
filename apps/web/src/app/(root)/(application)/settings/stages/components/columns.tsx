"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StageResponse } from "@/types/stages";
import { StagesActions } from "./stages-actions";

interface TableMeta {
  onDeleteSuccess?: () => void;
}

export const columns: ColumnDef<StageResponse>[] = [
  {
    accessorKey: "order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ordem
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const order = row.getValue("order") as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
            {order}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const color = row.original.color;
      return (
        <div className="flex items-center gap-2">
          {color && (
            <div
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: color }}
            />
          )}
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={type === "SALES" ? "default" : "secondary"}>
          {type === "SALES" ? "Vendas" : "Suporte"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const stage = row.original;
      if (stage.isWon) {
        return (
          <Badge variant="default" className="bg-green-600">
            Ganho
          </Badge>
        );
      }
      if (stage.isLost) {
        return <Badge variant="destructive">Perdido</Badge>;
      }
      return <Badge variant="outline">Ativo</Badge>;
    },
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => {
      const color = row.getValue("color") as string;
      if (!color) return <span className="text-gray-400">-</span>;

      return (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-600 font-mono">{color}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const stage = row.original;
      const onSuccess = (table.options.meta as TableMeta)?.onDeleteSuccess;
      // Precisamos passar todos os stages para as actions funcionarem
      const allStages = table.getFilteredRowModel().rows.map((r) => r.original);
      return (
        <StagesActions stage={stage} stages={allStages} onSuccess={onSuccess} />
      );
    },
  },
];
