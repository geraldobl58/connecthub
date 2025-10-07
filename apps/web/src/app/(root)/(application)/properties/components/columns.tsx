"use client";

import { ArrowUpDown, MapPin, Home, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PropertyResponse } from "@/types/properties";
import { PropertiesActions } from "./properties-actions";

interface TableMeta {
  onDeleteSuccess?: () => void;
}

export const columns: ColumnDef<PropertyResponse>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <div className="font-mono text-sm font-medium text-gray-900">
          {code}
        </div>
      );
    },
    size: 120,
    minSize: 100,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Propriedade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="min-w-[250px] max-w-[350px] space-y-1">
          <div className="font-semibold text-gray-900">{property.title}</div>
          {property.description && (
            <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {property.description}
            </div>
          )}
        </div>
      );
    },
    size: 350,
    minSize: 250,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const typeLabels = {
        HOUSE: "Casa",
        APARTMENT: "Apartamento",
        CONDO: "Cobertura",
        LAND: "Terreno",
        COMMERCIAL: "Comercial",
      };
      const typeColors = {
        HOUSE: "bg-green-100 text-green-800",
        APARTMENT: "bg-blue-100 text-blue-800",
        CONDO: "bg-purple-100 text-purple-800",
        LAND: "bg-yellow-100 text-yellow-800",
        COMMERCIAL: "bg-red-100 text-red-800",
      };

      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Home className="h-4 w-4 text-gray-400" />
          <Badge className={typeColors[type as keyof typeof typeColors]}>
            {typeLabels[type as keyof typeof typeLabels]}
          </Badge>
        </div>
      );
    },
    size: 150,
    minSize: 120,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusLabels = {
        ACTIVE: "Ativo",
        INACTIVE: "Inativo",
        RESERVED: "Reservado",
        SOLD: "Vendido",
        RENTED: "Alugado",
      };
      const statusColors = {
        ACTIVE: "bg-green-100 text-green-800",
        INACTIVE: "bg-gray-100 text-gray-800",
        RESERVED: "bg-yellow-100 text-yellow-800",
        SOLD: "bg-red-100 text-red-800",
        RENTED: "bg-blue-100 text-blue-800",
      };

      return (
        <Badge className={statusColors[status as keyof typeof statusColors]}>
          {statusLabels[status as keyof typeof statusLabels]}
        </Badge>
      );
    },
    size: 120,
    minSize: 100,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Preço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const minPrice = row.original.minPrice;
      const maxPrice = row.original.maxPrice;

      if (!price) {
        return <div className="text-gray-400 text-sm">Não informado</div>;
      }

      return (
        <div className="min-w-[150px] space-y-1">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              R${" "}
              {price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          {(minPrice || maxPrice) && (
            <div className="text-xs text-gray-500">
              {minPrice && maxPrice ? (
                <>
                  R$ {minPrice.toLocaleString()} - R${" "}
                  {maxPrice.toLocaleString()}
                </>
              ) : minPrice ? (
                <>A partir de R$ {minPrice.toLocaleString()}</>
              ) : (
                <>Até R$ {maxPrice?.toLocaleString()}</>
              )}
            </div>
          )}
        </div>
      );
    },
    size: 180,
    minSize: 150,
  },
  {
    accessorKey: "owner",
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
      const owner = row.getValue("owner") as PropertyResponse["owner"];
      if (!owner) {
        return <div className="text-gray-400 text-sm">Não informado</div>;
      }

      return (
        <div className="flex items-center gap-2 min-w-[150px]">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{owner.name}</div>
            {owner.email && (
              <div className="text-xs text-gray-500">{owner.email}</div>
            )}
          </div>
        </div>
      );
    },
    size: 200,
    minSize: 150,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Localização
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const address = row.getValue("address") as PropertyResponse["address"];
      if (!address) {
        return <div className="text-gray-400 text-sm">Não informado</div>;
      }

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <MapPin className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm text-gray-900">
              {address.district}, {address.city}
            </div>
            <div className="text-xs text-gray-500">{address.state}</div>
          </div>
        </div>
      );
    },
    size: 220,
    minSize: 200,
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
          Relacionamentos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("_count") as PropertyResponse["_count"];
      const leadsCount = count?.leads || 0;
      const dealsCount = count?.deals || 0;
      const tasksCount = count?.tasks || 0;
      const notesCount = count?.notes || 0;

      return (
        <div className="min-w-[150px] space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {leadsCount} leads
            </Badge>
            <Badge variant="outline" className="text-xs">
              {dealsCount} deals
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {tasksCount} tasks
            </Badge>
            <Badge variant="outline" className="text-xs">
              {notesCount} notes
            </Badge>
          </div>
        </div>
      );
    },
    size: 180,
    minSize: 150,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const property = row.original;
      const meta = table.options.meta as TableMeta;

      return (
        <PropertiesActions
          property={property}
          onDeleteSuccess={meta?.onDeleteSuccess}
        />
      );
    },
    size: 100,
    minSize: 80,
  },
];
