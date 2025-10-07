"use client";

import { OwnerResponse } from "@/types/owners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OwnerDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: OwnerResponse;
}

export const OwnerDetailDialog = ({
  isOpen,
  onClose,
  owner,
}: OwnerDetailDialogProps) => {
  const propertiesCount = owner._count?.properties || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Detalhes do Proprietário
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o proprietário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Nome
                </label>
                <p className="text-sm text-gray-900 font-medium">
                  {owner.name}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  {owner.email ? (
                    <>
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{owner.email}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">Não informado</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Telefone
                </label>
                <div className="flex items-center gap-2">
                  {owner.phone ? (
                    <>
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{owner.phone}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">Não informado</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Propriedades
                </label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <Badge
                    variant={propertiesCount > 0 ? "default" : "secondary"}
                  >
                    {propertiesCount}{" "}
                    {propertiesCount === 1 ? "propriedade" : "propriedades"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {owner.notes && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Observações
                </h3>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {owner.notes}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Propriedades Associadas */}
          {owner.properties && owner.properties.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Propriedades Associadas
                </h3>
                <div className="space-y-3">
                  {owner.properties.map((property) => (
                    <div
                      key={property.id}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {property.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            Código: {property.code}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {property.type}
                          </Badge>
                          <p className="text-sm text-gray-500">
                            {property.status}
                          </p>
                        </div>
                      </div>
                      {property.price && (
                        <p className="text-sm font-medium text-green-600 mt-2">
                          R${" "}
                          {property.price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Informações do Sistema */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informações do Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-sm text-gray-700 font-mono">{owner.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Tenant ID
                </label>
                <p className="text-sm text-gray-700 font-mono">
                  {owner.tenantId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
