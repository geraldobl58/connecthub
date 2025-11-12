import { Calendar, Building2, CheckCircle } from "lucide-react";
import { PlanCurrentInfoResponse } from "../types";

interface PlanCurrentCompanyProps {
  currentPlan?: PlanCurrentInfoResponse | null;
}

export const PlanCurrentCompany = ({
  currentPlan,
}: PlanCurrentCompanyProps) => {
  const status = currentPlan?.data?.plan.status || "UNKNOWN";
  const statusConfig = {
    ACTIVE: { color: "bg-green-500", label: "Ativo" },
    CANCELLED: { color: "bg-red-500", label: "Cancelado" },
    EXPIRED: { color: "bg-gray-500", label: "Expirado" },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-linear-to-br from-purple-600 via-purple-700 to-purple-900 text-white rounded-2xl p-8 shadow-lg overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full -ml-16 -mb-16" />

      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 opacity-75" />
              <p className="text-purple-100 text-sm font-medium">Empresa</p>
            </div>
            <h1 className="text-3xl font-bold truncate">
              {currentPlan?.data?.company.name}
            </h1>
            <span
              className={`inline-block ${currentStatus.color} text-white text-xs font-semibold px-3 py-1 rounded-full mt-2`}
            >
              {currentStatus.label}
            </span>
          </div>

          {/* Tenant ID */}
          <div className="space-y-2">
            <p className="text-purple-100 text-sm font-medium">Tenant ID</p>
            <p className="text-2xl font-bold font-mono break-all">
              {currentPlan?.data?.company.tenantId}
            </p>
            <div className="text-xs text-purple-200 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              ID Único
            </div>
          </div>

          {/* Creation Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 opacity-75" />
              <p className="text-purple-100 text-sm font-medium">Criado em</p>
            </div>
            <p className="text-lg font-semibold">
              {formatDate(currentPlan?.data?.company.createdAt || "")}
            </p>
          </div>
        </div>

        {/* Domain Info */}
        {currentPlan?.data?.company.domain && (
          <div className="mt-6 pt-6 border-t border-purple-400/30">
            <p className="text-purple-100 text-xs font-medium mb-1">Domínio</p>
            <p className="text-sm font-mono text-purple-100">
              {currentPlan?.data?.company.domain}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
