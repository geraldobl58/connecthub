"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
} from "@/schemas/property";
import { PropertiesActions } from "./properties-actions";

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("code")}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const description = row.original.description;

      return (
        <div className="space-y-1">
          <div className="font-medium">{title}</div>
          {description && (
            <div className="text-sm text-gray-500 line-clamp-1">
              {description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof PROPERTY_TYPE_LABELS;
      return <Badge variant="secondary">{PROPERTY_TYPE_LABELS[type]}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue(
        "status"
      ) as keyof typeof PROPERTY_STATUS_LABELS;
      const statusColors = {
        ACTIVE: "bg-green-100 text-green-800",
        INACTIVE: "bg-gray-100 text-gray-800",
        RESERVED: "bg-yellow-100 text-yellow-800",
        SOLD: "bg-blue-100 text-blue-800",
        RENTED: "bg-purple-100 text-purple-800",
      };

      return (
        <Badge className={statusColors[status]}>
          {PROPERTY_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const price = row.getValue("price") as number | undefined;
      return price ? (
        <div className="font-medium">{formatPrice(price)}</div>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{date.toLocaleDateString("pt-BR")}</div>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return <PropertiesActions property={row.original} />;
    },
  },
];
