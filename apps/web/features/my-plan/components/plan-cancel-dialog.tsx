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
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Lock,
} from "lucide-react";
import { cancelPlanAction } from "../actions";
import { CurrentPlan } from "../types";

interface PlanCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: CurrentPlan | null;
}

export function PlanCancelDialog({
  open,
  onOpenChange,
  currentPlan,
}: PlanCancelDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!confirmDelete) {
      setError("Por favor confirme que deseja cancelar seu plano");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await cancelPlanAction();

      if (result.success) {
        setSuccess(
          "Plano cancelado com sucesso! Seu acesso continuará até o final do período."
        );
        setTimeout(() => {
          onOpenChange(false);
          setConfirmDelete(false);
          window.location.reload();
        }, 3000);
      } else {
        setError(result.message || "Falha ao cancelar plano");
      }
    } catch (error) {
      console.error("Error canceling plan:", error);
      setError("Erro ao cancelar plano. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const expiresAt = currentPlan?.planExpiresAt
    ? new Date(currentPlan.planExpiresAt)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Cancelar Plano
          </SheetTitle>
          <SheetDescription>
            Você está prestes a cancelar sua assinatura
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6 p-6">
          {/* Warning Card */}
          <Card className="p-4 border-2 border-amber-200 bg-amber-50">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 mb-3">
                  ⚠️ Cancelamento Agendado
                </h3>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Seu acesso continuará até o final do período</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Você não será cobrado no próximo período</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>
                      Você pode reativar sua assinatura a qualquer momento
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>Downgrade será disponível após expiração</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Current Plan Info */}
          {currentPlan && (
            <Card className="p-4 border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Plano Atual</p>
                  <p className="font-bold text-lg text-gray-900">
                    {currentPlan.name}
                  </p>
                </div>

                {expiresAt && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">
                        Acesso disponível até
                      </p>
                      <p className="font-semibold text-gray-900">
                        {expiresAt.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded p-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-800">
                    Após a data, você perderá acesso completamente
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Alternatives Card */}
          <Card className="p-4 border-blue-200 bg-blue-50">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              💡 Outras Opções:
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Fazer downgrade para um plano menor após expiração</li>
              <li>✓ Pausar temporariamente (em breve)</li>
              <li>✓ Contacte nosso suporte para outras opções</li>
            </ul>
          </Card>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-4 border border-amber-300 bg-amber-50/50 rounded-lg cursor-pointer hover:bg-amber-50">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              className="h-4 w-4 text-amber-600 rounded mt-0.5"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700">
              Entendo que minha assinatura será cancelada ao final do período de
              cobrança
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setConfirmDelete(false);
              }}
              disabled={isLoading}
            >
              Manter Plano
            </Button>
            <Button
              onClick={handleCancel}
              disabled={!confirmDelete || isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Cancelando..." : "Cancelar Plano"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
