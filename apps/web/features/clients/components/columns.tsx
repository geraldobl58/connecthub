import { ColumnDef } from "@tanstack/react-table";
import { ClientResponse } from "../schemas/client";
import { ClientActions } from "./client-actions";

export const clientsColumns: ColumnDef<ClientResponse>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "neighborhood",
    header: "Bairro",
    cell: ({ row }) => <div>{row.original.neighborhood}</div>,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => <div>{row.original.phone || "-"}</div>,
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
    enableHiding: false,
    cell: ({ row }) => <ClientActions client={row.original} />,
  },
];
