"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Calendar,
  CreditCard,
  Zap,
} from "lucide-react";
import { LoadingSpinner } from "./common/loading-spinner";
import { plans } from "@/data/plans";
import { planHttpService } from "@/http/plan";
import { useUpgradePlan, useRenewPlan, usePlan } from "@/hooks/plan";

interface PlanCounterProps {
  currentPlan?: string;
  expiresAt?: string;
  tenantName?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export const PlanCounter = ({
  currentPlan = "STARTER",
  expiresAt,
}: PlanCounterProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isExpiringSoon: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Hook para buscar dados reais do plano
  const {
    currentPlan: planData,
    isLoading: isLoadingPlan,
    planError,
  } = usePlan();

  // Usar dados reais se disponíveis, senão usar props
  const actualPlan = planData?.name || currentPlan;
  const actualExpiresAt = planData?.planExpiresAt || expiresAt;

  const plan = plans.find((p) => p.id === actualPlan) || plans[0];

  // Hooks para gerenciar planos
  const {
    upgradePlan,
    isLoading: isUpgrading,
    error: upgradeError,
  } = useUpgradePlan();
  const {
    renewPlan,
    isLoading: isRenewing,
    error: renewError,
  } = useRenewPlan();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!actualExpiresAt || !isMounted) return;

    const updateTimeRemaining = () => {
      const timeData = planHttpService.calculateTimeRemaining(actualExpiresAt);
      setTimeRemaining(timeData);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [actualExpiresAt, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size={24} text="Carregando..." />
      </div>
    );
  }

  if (isLoadingPlan) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size={24} text="Carregando plano..." />
      </div>
    );
  }

  if (planError) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">Erro ao Carregar Plano</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">
                  Erro ao carregar dados do plano
                </p>
                <p className="text-red-700">{planError}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (timeRemaining.isExpired) return "bg-red-500";
    if (timeRemaining.isExpiringSoon) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = () => {
    if (timeRemaining.isExpired) return <AlertTriangle className="h-4 w-4" />;
    if (timeRemaining.isExpiringSoon)
      return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (timeRemaining.isExpired) return "Plano Expirado";
    if (timeRemaining.isExpiringSoon) return "Expira em Breve";
    return "Plano Ativo";
  };

  const formatExpiryDate = () => {
    if (!actualExpiresAt) return "Data não disponível";
    return planHttpService.formatExpiryDate(actualExpiresAt);
  };

  const handleRenewPlan = () => {
    renewPlan({
      plan: actualPlan as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    });
  };

  const handleUpgradePlan = () => {
    const nextPlan = actualPlan === "STARTER" ? "PROFESSIONAL" : "ENTERPRISE";
    upgradePlan({
      newPlan: nextPlan as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <plan.icon className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Plano {plan.name}</CardTitle>
          </div>
          <Badge
            variant={
              timeRemaining.isExpired
                ? "destructive"
                : timeRemaining.isExpiringSoon
                  ? "outline"
                  : "default"
            }
            className={`${getStatusColor()} text-white flex items-center gap-1`}
          >
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
        <CardDescription>
          Acompanhe o tempo restante da sua assinatura
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contador Principal */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {timeRemaining.days}
            </div>
            <div className="text-xs text-gray-600">Dias</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {timeRemaining.hours}
            </div>
            <div className="text-xs text-gray-600">Horas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600">
              {timeRemaining.minutes}
            </div>
            <div className="text-xs text-gray-600">Min</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">
              {timeRemaining.seconds}
            </div>
            <div className="text-xs text-gray-600">Seg</div>
          </div>
        </div>

        {/* Informações do Plano */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Expira em:</span>
            </div>
            <span className="font-medium">{formatExpiryDate()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="h-4 w-4" />
              <span>Valor mensal:</span>
            </div>
            <span className="font-medium text-green-600">
              {planData?.currency || "BRL"} {planData?.price || plan.price}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="border-t pt-4 space-y-2">
          {timeRemaining.isExpired && (
            <Button
              onClick={handleRenewPlan}
              className="w-full"
              variant="destructive"
              disabled={isRenewing}
            >
              {isRenewing ? (
                <LoadingSpinner size={16} text="Renovando..." />
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Renovar Plano Agora
                </>
              )}
            </Button>
          )}

          {timeRemaining.isExpiringSoon && !timeRemaining.isExpired && (
            <Button
              onClick={handleRenewPlan}
              className="w-full"
              variant="outline"
              disabled={isRenewing}
            >
              {isRenewing ? (
                <LoadingSpinner size={16} text="Renovando..." />
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Renovar Plano
                </>
              )}
            </Button>
          )}

          {!timeRemaining.isExpired && plan.id !== "ENTERPRISE" && (
            <Button
              onClick={handleUpgradePlan}
              className="w-full"
              variant="outline"
              disabled={isUpgrading}
            >
              {isUpgrading ? (
                <LoadingSpinner size={16} text="Fazendo Upgrade..." />
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Fazer Upgrade
                </>
              )}
            </Button>
          )}
        </div>

        {/* Alerta de Expiração */}
        {timeRemaining.isExpiringSoon && !timeRemaining.isExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Atenção!</p>
                <p className="text-yellow-700">
                  Seu plano expira em {timeRemaining.days} dias. Renove agora
                  para evitar interrupção do serviço.
                </p>
              </div>
            </div>
          </div>
        )}

        {timeRemaining.isExpired && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Plano Expirado!</p>
                <p className="text-red-700">
                  Seu acesso está limitado. Renove seu plano para continuar
                  usando todos os recursos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mensagens de Erro */}
        {renewError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Erro na Renovação</p>
                <p className="text-red-700">{renewError}</p>
              </div>
            </div>
          </div>
        )}

        {upgradeError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Erro no Upgrade</p>
                <p className="text-red-700">{upgradeError}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
