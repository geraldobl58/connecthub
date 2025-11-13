"use client";

import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/loading";
import { useContract } from "../hooks/useContracts";

interface ContractViewProps {
  contractId: string;
}

export const ContractView = ({ contractId }: ContractViewProps) => {
  const { contract, isLoading, error } = useContract(contractId);

  if (isLoading) {
    return (
      <Loading
        fullscreen
        color="blue"
        title="Carregando contrato..."
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
                Erro ao carregar contrato
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
          <CardTitle>{contract?.title}</CardTitle>
          <CardDescription>Título</CardDescription>
        </div>
        <div>
          <CardTitle>{contract?.identifier}</CardTitle>
          <CardDescription>Identificador</CardDescription>
        </div>

        <div>
          <CardTitle>
            {format(
              new Date(contract?.initialEffectiveDate || ""),
              "dd/MM/yyyy"
            ) || "-"}
          </CardTitle>
          <CardDescription>Data Inicial de Vigência</CardDescription>
        </div>
        <div>
          <CardTitle>
            {format(
              new Date(contract?.finalEffectiveDate || ""),
              "dd/MM/yyyy"
            ) || "-"}
          </CardTitle>
          <CardDescription>Data Final de Vigência</CardDescription>
        </div>
        <div>
          <CardTitle>{contract?.clients?.name || "-"}</CardTitle>
          <CardDescription>Cliente</CardDescription>
        </div>
        <div>
          <CardTitle>
            {format(new Date(contract?.signedAt || ""), "dd/MM/yyyy") || "-"}
          </CardTitle>
          <CardDescription>Data de Assinatura</CardDescription>
        </div>
      </CardContent>
      <CardContent>
        <div>
          <CardTitle>{contract?.content || "-"}</CardTitle>
          <CardDescription>Descrição</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
