"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useClient } from "../hooks/useClients";
import { Loading } from "@/components/loading";
import { AlertCircle } from "lucide-react";

interface ClientViewProps {
  clientId: string;
}

export const ClientView = ({ clientId }: ClientViewProps) => {
  const { client, isLoading, error } = useClient(clientId);

  if (isLoading) {
    return (
      <Loading
        fullscreen
        color="blue"
        title="Carregando usuário..."
        message="Aguarde enquanto buscamos suas informações."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
            <div className="shrink-0 pt-1">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">
                Erro ao carregar perfil
              </h3>
              <p className="text-red-800 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <CardTitle>{client?.name}</CardTitle>
          <CardDescription>Cliente</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.email}</CardTitle>
          <CardDescription>E-mail</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.address}</CardTitle>
          <CardDescription>Endereço</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.neighborhood}</CardTitle>
          <CardDescription>Bairro</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.number}</CardTitle>
          <CardDescription>Número</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.complement || "-"}</CardTitle>
          <CardDescription>Complemento</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.phone}</CardTitle>
          <CardDescription>Telefone</CardDescription>
        </div>
        <div>
          <CardTitle>{client?.zipCode}</CardTitle>
          <CardDescription>CEP</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
