"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, X, TrendingUp, AlertCircle } from "lucide-react";
import { upgradePlanAction } from "../actions";
import { AvailablePlan, PlanUpgradeDto } from "../types";

interface PlanUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanPrice: number;
  availablePlans: AvailablePlan[];
}

export function PlanUpgradeDialog({
  open,
  onOpenChange,
  currentPlanPrice,
  availablePlans,
}: PlanUpgradeDialogProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!selectedPlanId) {
      setError("Por favor selecione um plano");
      return;
    }

    const selectedPlan = upgradablePlans.find((p) => p.id === selectedPlanId);
    if (!selectedPlan) {
      setError("Plano não encontrado");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const upgradeDto: PlanUpgradeDto = {
        stripePriceId: selectedPlan.priceId,
      };

      console.log("[PlanUpgradeDialog] Sending upgrade DTO:", upgradeDto);
      console.log("[PlanUpgradeDialog] Selected plan:", selectedPlan);

      const result = await upgradePlanAction(upgradeDto);

      console.log("[PlanUpgradeDialog] Upgrade result:", result);

      if (result.success) {
        setSuccess("Plano atualizado com sucesso!");
        setTimeout(() => {
          onOpenChange(false);
          setSelectedPlanId(null);
          setSuccess(null);
          // Recarregar a página para mostrar os dados novos
          window.location.reload();
        }, 2000);
      } else {
        setError(result.message || "Falha ao atualizar plano");
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      setError("Erro ao atualizar plano. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only show plans with higher price (true upgrades)
  const upgradablePlans = availablePlans.filter(
    (plan) => plan.price > currentPlanPrice
  );

  const selectedPlan = availablePlans.find((p) => p.id === selectedPlanId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Fazer Upgrade
          </SheetTitle>
          <SheetDescription>
            Selecione um plano superior para obter mais recursos
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6 p-6">
          {/* Available Plans Grid */}
          <div className="space-y-3">
            {upgradablePlans.length > 0 ? (
              upgradablePlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-6 cursor-pointer transition-all border-2 ${
                    selectedPlanId === plan.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {plan.currency}
                          {plan.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          por mês
                        </div>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">
                          {plan.maxUsers || "∞"} usuários
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">
                          {plan.maxContacts || "∞"} contatos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.hasAPI ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">API Incluída</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Sem API
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Você já está no plano superior</p>
                <p className="text-sm text-gray-500 mt-2">
                  Downgrade está disponível após sua assinatura expirar
                </p>
              </div>
            )}
          </div>

          {/* Selected Plan Details */}
          {selectedPlan && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Confirmando upgrade:</p>
                  <p>
                    Você será cobrado{" "}
                    <span className="font-bold">
                      {selectedPlan.currency}
                      {selectedPlan.price.toFixed(2)}
                    </span>{" "}
                    imediatamente no seu próximo período de cobrança. Seu plano
                    será atualizado instantaneamente.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setError(null);
                setSuccess(null);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={!selectedPlanId || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Atualizando..." : "Confirmar Upgrade"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
