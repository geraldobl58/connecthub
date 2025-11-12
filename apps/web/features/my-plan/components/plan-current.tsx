import {
  Calendar,
  CalendarOff,
  Contact,
  DollarSign,
  Notebook,
  Route,
  Users,
  Webhook,
  Check,
  X,
  AlertCircle,
  Clock,
  Hourglass,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PlanCurrentInfoResponse } from "../types";

interface PlanCurrentProps {
  currentPlan?: PlanCurrentInfoResponse | null;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: "blue" | "green" | "amber" | "red";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isTrial: boolean;
  isExpiring: boolean;
}

const TimeCounter = ({
  expiresAt,
  planName,
}: {
  expiresAt: string;
  planName: string;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expirationDate = new Date(expiresAt).getTime();
      const difference = expirationDate - now;

      if (difference <= 0) {
        return null;
      }

      const isTrial = planName.toUpperCase() === "TRIAL";
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const isExpiring = isTrial
        ? difference < 30 * 60 * 1000
        : difference < 24 * 60 * 60 * 1000;

      return {
        days,
        hours,
        minutes,
        seconds,
        isTrial,
        isExpiring,
      };
    };

    // Atualizar imediatamente
    const update = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    update();

    // Atualizar a cada segundo
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, planName]);

  if (!timeRemaining) {
    return null;
  }

  const { days, hours, minutes, seconds, isTrial, isExpiring } = timeRemaining;

  if (isTrial) {
    return (
      <div
        className={`${
          isExpiring ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
        } border rounded-xl p-4`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Hourglass
            className={`size-5 ${
              isExpiring ? "text-red-600" : "text-blue-600"
            }`}
          />
          <p
            className={`font-semibold ${
              isExpiring ? "text-red-900" : "text-blue-900"
            }`}
          >
            Tempo restante do TRIAL
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white/60 rounded p-2 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {String(hours).padStart(2, "0")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Horas</p>
          </div>
          <div className="bg-white/60 rounded p-2 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {String(minutes).padStart(2, "0")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Minutos</p>
          </div>
          <div className="bg-white/60 rounded p-2 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {String(seconds).padStart(2, "0")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Segundos</p>
          </div>
          <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded p-2 text-center">
            <p className="text-xs text-white font-semibold mt-1">TRIAL</p>
            <p className="text-xs text-white/90">GRÁTIS</p>
          </div>
        </div>
        {isExpiring && (
          <p className="text-sm text-red-700 mt-3 font-medium">
            ⚠️ Seu TRIAL está terminando! Faça upgrade para continuar usando o
            ConnectHub.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${
        isExpiring
          ? "bg-amber-50 border-amber-200"
          : "bg-blue-50 border-blue-200"
      } border rounded-xl p-4`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock
          className={`size-5 ${isExpiring ? "text-amber-600" : "text-blue-600"}`}
        />
        <p
          className={`font-semibold ${
            isExpiring ? "text-amber-900" : "text-blue-900"
          }`}
        >
          Tempo até renovação
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white/60 rounded p-2 text-center">
          <p className="text-2xl font-bold text-gray-900">{days}</p>
          <p className="text-xs text-gray-600 mt-1">Dias</p>
        </div>
        <div className="bg-white/60 rounded p-2 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {String(hours).padStart(2, "0")}
          </p>
          <p className="text-xs text-gray-600 mt-1">Horas</p>
        </div>
        <div className="bg-white/60 rounded p-2 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {String(minutes).padStart(2, "0")}
          </p>
          <p className="text-xs text-gray-600 mt-1">Minutos</p>
        </div>
        <div className="bg-white/60 rounded p-2 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {String(seconds).padStart(2, "0")}
          </p>
          <p className="text-xs text-gray-600 mt-1">Segundos</p>
        </div>
      </div>
      {isExpiring && (
        <p className="text-sm text-amber-700 mt-3 font-medium">
          ⚠️ Seu plano está terminando em menos de 24 horas. Ele será renovado
          automaticamente.
        </p>
      )}
    </div>
  );
};

const InfoCard = ({ icon, label, value, color = "blue" }: InfoCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    red: "bg-red-50 border-red-200",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4 space-y-2`}>
      <div className="flex items-center gap-2">
        <div className={`${iconColorClasses[color]} shrink-0`}>{icon}</div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <div className="text-md font-medium text-gray-900">{value}</div>
    </div>
  );
};

export const PlanCurrent = ({ currentPlan }: PlanCurrentProps) => {
  const planStatus = currentPlan?.data?.plan.status || "ACTIVE";
  const isCanceled = planStatus === "CANCELED";
  const isExpired = planStatus === "EXPIRED";
  const planName = currentPlan?.data?.plan.name || "";
  const isTrial = planName.toUpperCase() === "TRIAL";

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      {(isCanceled || isExpired) && (
        <div
          className={`${
            isCanceled
              ? "bg-amber-50 border-amber-200"
              : "bg-red-50 border-red-200"
          } border rounded-2xl p-4 flex items-start gap-4`}
        >
          <div className="shrink-0 pt-1">
            {isCanceled ? (
              <Clock className="size-5 text-amber-600" />
            ) : (
              <AlertCircle className="size-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold mb-2 ${
                isCanceled ? "text-amber-900" : "text-red-900"
              }`}
            >
              {isCanceled
                ? "⏳ Seu plano foi cancelado"
                : "❌ Seu plano expirou"}
            </h3>
            <p
              className={`text-sm ${
                isCanceled ? "text-amber-800" : "text-red-800"
              }`}
            >
              {isCanceled ? (
                <>
                  Você tem acesso até{" "}
                  <strong>
                    {new Date(
                      currentPlan?.data?.plan.planExpiresAt || ""
                    ).toLocaleDateString("pt-BR")}
                  </strong>
                  . Reative sua assinatura para continuar usando todos os
                  recursos.
                </>
              ) : (
                <>
                  Seu acesso expirou em{" "}
                  <strong>
                    {new Date(
                      currentPlan?.data?.plan.planExpiresAt || ""
                    ).toLocaleDateString("pt-BR")}
                  </strong>
                  . Reative sua assinatura ou faça upgrade para continuar.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Time Counter - mostrar sempre que há um planExpiresAt */}
      {currentPlan?.data?.plan.planExpiresAt && !isExpired && !isCanceled && (
        <TimeCounter
          expiresAt={currentPlan.data.plan.planExpiresAt}
          planName={planName}
        />
      )}

      {/* Main Plan Info */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Detalhes do Plano
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={<Route className="size-5" />}
            label="Seu plano atual"
            value={
              <div className="flex items-center gap-2">
                {currentPlan?.data?.plan.name}
                {isTrial && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    GRÁTIS
                  </span>
                )}
              </div>
            }
            color="blue"
          />

          <InfoCard
            icon={<DollarSign className="size-5" />}
            label="Valor"
            value={
              isTrial ? (
                <span className="text-green-600 font-semibold">
                  Grátis por 2 horas
                </span>
              ) : (
                `R$ ${currentPlan?.data?.plan.price.toFixed(2)}/mês`
              )
            }
            color={isTrial ? "green" : "green"}
          />

          <InfoCard
            icon={<Calendar className="size-5" />}
            label="Criado em"
            value={
              currentPlan?.data?.plan.createdAt
                ? new Date(currentPlan.data.plan.createdAt).toLocaleDateString(
                    "pt-BR"
                  )
                : "—"
            }
            color="blue"
          />

          <InfoCard
            icon={<CalendarOff className="size-5" />}
            label={isTrial ? "Expira em (TRIAL)" : "Renova em"}
            value={
              currentPlan?.data?.plan.planExpiresAt
                ? new Date(
                    currentPlan.data.plan.planExpiresAt
                  ).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
            color={isTrial ? "amber" : "blue"}
          />

          <InfoCard
            icon={<Notebook className="size-5" />}
            label="Descrição"
            value={currentPlan?.data?.plan.description || "—"}
            color="blue"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recursos do Plano
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon={<Users className="size-5" />}
            label="Usuários permitidos"
            value={`${currentPlan?.data?.plan.maxUsers} usuários`}
            color="blue"
          />

          <InfoCard
            icon={<Contact className="size-5" />}
            label="Contatos"
            value={`${currentPlan?.data?.plan.maxContacts} contatos`}
            color="blue"
          />

          <div
            className={`${currentPlan?.data?.plan.hasAPI ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-xl p-4 space-y-2`}
          >
            <div className="flex items-center gap-2">
              <Webhook
                className={`${currentPlan?.data?.plan.hasAPI ? "text-green-600" : "text-red-600"} shrink-0 size-5`}
              />
              <p className="text-sm font-medium text-gray-600">Acesso à API</p>
            </div>
            <p className="text-md font-medium text-gray-900 flex items-center gap-2">
              {currentPlan?.data?.plan.hasAPI ? (
                <>
                  <Check className="size-5 text-green-600" />
                  Ativada
                </>
              ) : (
                <>
                  <X className="size-5 text-red-600" />
                  Desativada
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
