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
import { Loader2, AlertCircle, CheckCircle, Shield, Info } from "lucide-react";
import { validateSubscriptionAction } from "../actions";

interface PlanValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanValidationDialog({
  open,
  onOpenChange,
}: PlanValidationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidate = async () => {
    setIsLoading(true);
    setError(null);
    setIsValid(null);

    try {
      const result = await validateSubscriptionAction();

      if (result.success && result.data) {
        setIsValid(result.data.isValid);
      } else {
        setError(result.message || "Falha ao validar assinatura");
      }
    } catch (error) {
      console.error("Error validating subscription:", error);
      setError("Erro ao validar assinatura. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Validar Assinatura
          </SheetTitle>
          <SheetDescription>
            Verifique o status de sua assinatura
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6 p-6">
          {/* Info Card */}
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">O que é validação?</p>
                <p>
                  Validamos se sua assinatura está ativa e todos os seus
                  benefícios estão disponíveis corretamente.
                </p>
              </div>
            </div>
          </Card>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-semibold mb-1">Erro</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Valid State */}
          {isValid === true && !isLoading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 text-lg mb-1">
                Assinatura Válida!
              </h3>
              <p className="text-sm text-green-800">
                Sua assinatura está ativa e todos os benefícios estão
                disponíveis.
              </p>
            </div>
          )}

          {/* Invalid State */}
          {isValid === false && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-red-900 text-lg mb-1">
                Assinatura Inválida
              </h3>
              <p className="text-sm text-red-800">
                Sua assinatura pode ter expirado ou há um problema com seus
                dados de pagamento.
              </p>
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700 w-full"
                onClick={() => onOpenChange(false)}
              >
                Contatar Suporte
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">
                Validando assinatura...
              </span>
            </div>
          )}

          {/* Action Buttons */}
          {isValid !== null && !isLoading && (
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          )}

          {/* Initial Action Button */}
          {isValid === null && !isLoading && (
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleValidate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Validar Agora
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
