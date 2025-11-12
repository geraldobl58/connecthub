"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import {
  getCurrentPlanAction,
  getAvailablePlansAction,
} from "@/features/my-plan/actions";
import { Loading } from "@/components/loading";
import { PlanCurrentInfoResponse } from "@/features/my-plan/types";
import { Button } from "@/components/ui/button";
import { PlanCurrentCompany } from "@/features/my-plan/components/plan-company";
import { PlanCurrent } from "@/features/my-plan/components/plan-current";
import { PlanUsage } from "@/features/my-plan/components/plan-usage";
import { PlanUpgradeDialog } from "@/features/my-plan/components/plan-upgrade-dialog";
import { PlanCancelDialog } from "@/features/my-plan/components/plan-cancel-dialog";
import { PlanHistoryDialog } from "@/features/my-plan/components/plan-history-dialog";
import { PlanValidationDialog } from "@/features/my-plan/components/plan-validation-dialog";
import type { AvailablePlan } from "@/features/my-plan/http";

const MyPlanPage = () => {
  const [currentPlan, setCurrentPlan] =
    useState<PlanCurrentInfoResponse | null>(null);
  const [availablePlans, setAvailablePlans] = useState<AvailablePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [planResult, plansResult] = await Promise.all([
      getCurrentPlanAction(),
      getAvailablePlansAction(),
    ]);

    setCurrentPlan(planResult);

    if (plansResult.success && plansResult.data) {
      setAvailablePlans(plansResult.data);
    }

    setIsLoading(false);

    if (!planResult.success) {
      setError(planResult.message || "Erro ao carregar informações do plano.");
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  if (isLoading) {
    return (
      <Loading
        fullscreen
        color="blue"
        title="Carregando informações do plano..."
        message="Aguarde enquanto buscamos suas informações."
      />
    );
  }

  if (error) {
    return (
      <>
        <HeaderContainer
          title="Meu Perfil"
          subtitle="Visão geral da sua conta"
          content={
            <>
              <ProfileHeader />
            </>
          }
        />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="shrink-0 pt-1">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Erro ao carregar informações do plano
                </h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentPlanPrice = currentPlan?.data?.plan.price || 0;
  const planStatus = currentPlan?.data?.plan.status || "ACTIVE";
  const isActive = planStatus === "ACTIVE";
  const isCanceled = planStatus === "CANCELED";
  const isExpired = planStatus === "EXPIRED";

  return (
    <>
      <HeaderContainer
        title="Planos e Assinatura"
        subtitle="Gerencie seu plano e visualize o uso"
        content={<ProfileHeader />}
      />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <PlanCurrentCompany currentPlan={currentPlan} />
            <PlanCurrent currentPlan={currentPlan} />
            <PlanUsage currentPlan={currentPlan} />

            {/* Action Buttons - Condicional por Status */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-3">
                {/* ATIVO: Upgrade + Cancelar */}
                {isActive && (
                  <>
                    <Button
                      onClick={() => setUpgradeDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Fazer upgrade
                    </Button>

                    <Button
                      onClick={() => setCancelDialogOpen(true)}
                      variant="destructive"
                    >
                      Cancelar plano
                    </Button>
                  </>
                )}

                {/* CANCELADO: Reativar */}
                {isCanceled && (
                  <Button
                    onClick={() => setUpgradeDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    🔄 Reativar Plano
                  </Button>
                )}

                {/* EXPIRADO: Reativar (primário) + Upgrade (secundário) */}
                {isExpired && (
                  <>
                    <Button
                      onClick={() => setUpgradeDialogOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      🔄 Reativar Plano
                    </Button>
                    <Button
                      onClick={() => setUpgradeDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Fazer Upgrade
                    </Button>
                  </>
                )}

                {/* Botões Sempre Visíveis */}
                <Button
                  onClick={() => setHistoryDialogOpen(true)}
                  variant="outline"
                >
                  Ver histórico
                </Button>

                <Button
                  onClick={() => setValidationDialogOpen(true)}
                  variant="outline"
                >
                  Validar assinatura
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <PlanUpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentPlanPrice={currentPlanPrice}
        availablePlans={availablePlans}
      />

      <PlanCancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        currentPlan={currentPlan?.data?.plan || null}
      />

      <PlanHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />

      <PlanValidationDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
      />
    </>
  );
};

export default MyPlanPage;
