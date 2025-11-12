"use client";

import { useEffect, useState } from "react";
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
  AlertCircle,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import { getPlanHistoryDetailedAction } from "../actions";
import type { PlanHistoryDetailEvent } from "../http";

interface PlanHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanHistoryDialog({
  open,
  onOpenChange,
}: PlanHistoryDialogProps) {
  const [history, setHistory] = useState<PlanHistoryDetailEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPlanHistoryDetailedAction();

      if (result.success && result.data) {
        setHistory(result.data);
      } else {
        setError(result.message || "Falha ao carregar histórico de planos");
      }
    } catch (error) {
      console.error("Error fetching plan history:", error);
      setError("Erro ao carregar histórico de planos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATED":
        return "bg-blue-50 border-blue-200";
      case "UPGRADED":
        return "bg-green-50 border-green-200";
      case "DOWNGRADED":
        return "bg-yellow-50 border-yellow-200";
      case "RENEWED":
        return "bg-purple-50 border-purple-200";
      case "CANCELED":
        return "bg-red-50 border-red-200";
      case "REACTIVATED":
        return "bg-emerald-50 border-emerald-200";
      case "EXPIRED":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATED":
        return "🎯";
      case "UPGRADED":
        return "📈";
      case "DOWNGRADED":
        return "📉";
      case "RENEWED":
        return "🔄";
      case "CANCELED":
        return "❌";
      case "REACTIVATED":
        return "♻️";
      case "EXPIRED":
        return "⏰";
      default:
        return "•";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Histórico de Planos
          </SheetTitle>
          <SheetDescription>
            Visualize a timeline de todos os seus planos
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6 p-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2">Carregando histórico...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-semibold mb-1">Erro</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && history.length === 0 && (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Nenhum histórico de planos encontrado
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Seu histórico aparecerá aqui quando você mudar de plano
              </p>
            </Card>
          )}

          {/* Timeline */}
          {!isLoading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center text-lg">
                      {getActionIcon(event.action)}
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-16 bg-linear-to-b from-purple-200 to-purple-100 mt-2" />
                    )}
                  </div>

                  {/* Event card */}
                  <Card
                    className={`flex-1 p-4 border-l-4 ${getActionColor(
                      event.action
                    )}`}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {event.description}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(event.timestamp)}</span>
                          </div>
                        </div>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-700">
                          {event.action}
                        </span>
                      </div>

                      {/* Plan transition */}
                      {(event.previousPlan || event.currentPlan) && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50">
                          {event.previousPlan && (
                            <>
                              <span className="text-sm font-medium text-gray-700">
                                {event.previousPlan}
                              </span>
                              <span className="text-gray-400">→</span>
                            </>
                          )}
                          {event.currentPlan && (
                            <span className="text-sm font-medium text-gray-900">
                              {event.currentPlan}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Additional info */}
                      {(event.reason || event.triggeredBy) && (
                        <div className="text-xs text-gray-600 space-y-1 pt-1">
                          {event.reason && (
                            <p className="text-gray-700">
                              <span className="font-medium">Motivo:</span>{" "}
                              {event.reason}
                            </p>
                          )}
                          {event.triggeredBy && (
                            <p>
                              <span className="font-medium">Acionado por:</span>{" "}
                              {event.triggeredBy === "user"
                                ? "Você"
                                : event.triggeredBy === "stripe"
                                  ? "Stripe"
                                  : "Sistema"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end gap-3 p-6 mt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
