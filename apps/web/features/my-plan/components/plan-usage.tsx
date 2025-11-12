import { UsersRound, Contact, Webhook, AlertCircle } from "lucide-react";

import { PlanCurrentInfoResponse } from "../types";

interface PlanUsageProps {
  currentPlan?: PlanCurrentInfoResponse | null;
}

interface UsageBarProps {
  label: string;
  current: number;
  max: number;
  icon: React.ReactNode;
  color?: "blue" | "amber" | "red";
}

const UsageBar = ({ label, current, max, icon }: UsageBarProps) => {
  const percentage = (current / max) * 100;
  const isWarning = percentage > 75;
  const isCritical = percentage > 90;

  const bgColor = isCritical
    ? "bg-red-500"
    : isWarning
      ? "bg-amber-500"
      : "bg-blue-500";
  const bgLightColor = isCritical
    ? "bg-red-50"
    : isWarning
      ? "bg-amber-50"
      : "bg-blue-50";
  const borderColor = isCritical
    ? "border-red-200"
    : isWarning
      ? "border-amber-200"
      : "border-blue-200";
  const textColor = isCritical
    ? "text-red-700"
    : isWarning
      ? "text-amber-700"
      : "text-blue-700";

  return (
    <div
      className={`${bgLightColor} border ${borderColor} rounded-xl p-4 space-y-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={textColor}>{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-600">
              {current} de {max}
            </p>
          </div>
        </div>
        <div className={`text-lg font-bold ${textColor}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`${bgColor} h-full rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Status Message */}
      {isCritical && (
        <div className="flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>Limite crítico</span>
        </div>
      )}
      {isWarning && !isCritical && (
        <div className="flex items-center gap-2 text-xs text-amber-700">
          <AlertCircle className="w-4 h-4" />
          <span>Próximo ao limite</span>
        </div>
      )}
    </div>
  );
};

export const PlanUsage = ({ currentPlan }: PlanUsageProps) => {
  const remainingUsers =
    (currentPlan?.data?.usage.maxUsers || 0) -
    (currentPlan?.data?.usage.currentUsers || 0);

  return (
    <div className="space-y-4">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Uso do Plano</h2>

        {/* Usage Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <UsageBar
            icon={<UsersRound className="size-5" />}
            label="Usuários em uso"
            current={currentPlan?.data?.usage.currentUsers || 0}
            max={currentPlan?.data?.usage.maxUsers || 0}
            color="blue"
          />

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <UsersRound className="size-5 text-blue-700" />
              <p className="text-sm font-medium text-gray-700">
                Usuários restantes
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{remainingUsers}</p>
            <p className="text-xs text-gray-600">
              Ainda é possível criar {remainingUsers}{" "}
              {remainingUsers === 1 ? "usuário" : "usuários"}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Contact className="size-5 text-purple-700" />
              <p className="text-sm font-medium text-gray-700">
                Contatos restantes
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {currentPlan?.data?.limits.contacts.limit}
            </p>
            <p className="text-xs text-gray-600">
              Ainda é possível criar {currentPlan?.data?.limits.contacts.limit}{" "}
              contato(s)
            </p>
          </div>

          <div
            className={`${currentPlan?.data?.limits.api.enabled ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border rounded-xl p-4 space-y-2`}
          >
            <div className="flex items-center gap-2">
              <Webhook
                className={`size-5 ${currentPlan?.data?.limits.api.enabled ? "text-green-700" : "text-gray-700"}`}
              />
              <p className="text-sm font-medium text-gray-700">API</p>
            </div>
            <p
              className={`text-md font-medium ${currentPlan?.data?.limits.api.enabled ? "text-green-700" : "text-gray-700"}`}
            >
              {currentPlan?.data?.limits.api.enabled ? "Ativada" : "Desativada"}
            </p>
            <p className="text-xs text-gray-600">
              {currentPlan?.data?.limits.api.enabled
                ? "Você pode fazer chamadas à API"
                : "Seu plano não permite chamadas à API"}
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Dica</p>
          <p>
            Monitore seu uso regularmente. Se precisar de mais recursos,
            considere fazer um upgrade do seu plano.
          </p>
        </div>
      </div>
    </div>
  );
};
