"use client";

import { PropertyResponse } from "@/types/properties";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  MapPin,
  DollarSign,
  User,
  Bed,
  Bath,
  Car,
  Square,
  FileText,
  Calendar,
  Building,
} from "lucide-react";

interface PropertyDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyResponse;
}

export const PropertyDetailDialog = ({
  isOpen,
  onClose,
  property,
}: PropertyDetailDialogProps) => {
  const typeLabels = {
    HOUSE: "Casa",
    APARTMENT: "Apartamento",
    CONDO: "Cobertura",
    LAND: "Terreno",
    COMMERCIAL: "Comercial",
  };

  const statusLabels = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    RESERVED: "Reservado",
    SOLD: "Vendido",
    RENTED: "Alugado",
  };

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    RESERVED: "bg-yellow-100 text-yellow-800",
    SOLD: "bg-red-100 text-red-800",
    RENTED: "bg-blue-100 text-blue-800",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Detalhes da Propriedade
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a propriedade
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
                  Código
                </label>
                <p className="text-sm text-gray-900 font-mono font-medium">
                  {property.code}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Título
                </label>
                <p className="text-sm text-gray-900 font-medium">
                  {property.title}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Tipo
                </label>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  <Badge variant="outline">{typeLabels[property.type]}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <Badge className={statusColors[property.status]}>
                  {statusLabels[property.status]}
                </Badge>
              </div>
            </div>

            {property.description && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Descrição
                </label>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Preços */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Preços</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.price && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Preço
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-semibold text-green-600">
                      R${" "}
                      {property.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {property.minPrice && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Preço Mínimo
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">
                      R${" "}
                      {property.minPrice.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {property.maxPrice && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Preço Máximo
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">
                      R${" "}
                      {property.maxPrice.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Características */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Características
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {property.bedroom && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Quartos
                  </label>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{property.bedroom}</p>
                  </div>
                </div>
              )}

              {property.bathroom && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Banheiros
                  </label>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{property.bathroom}</p>
                  </div>
                </div>
              )}

              {property.parking && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Vagas
                  </label>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{property.parking}</p>
                  </div>
                </div>
              )}

              {property.area && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Área
                  </label>
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-700">{property.area} m²</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Proprietário */}
          {property.owner && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Proprietário
                </h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {property.owner.name}
                    </p>
                    {property.owner.email && (
                      <p className="text-xs text-gray-500">
                        {property.owner.email}
                      </p>
                    )}
                    {property.owner.phone && (
                      <p className="text-xs text-gray-500">
                        {property.owner.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Endereço */}
          {property.address && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Endereço
                </h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    {property.address.street && (
                      <p>
                        {property.address.street}
                        {property.address.number &&
                          `, ${property.address.number}`}
                      </p>
                    )}
                    {property.address.district && (
                      <p>{property.address.district}</p>
                    )}
                    <p>
                      {property.address.city}, {property.address.state}
                    </p>
                    {property.address.zip && <p>CEP: {property.address.zip}</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Relacionamentos */}
          {property._count && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Relacionamentos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {property._count.leads}
                    </p>
                    <p className="text-sm text-gray-500">Leads</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {property._count.deals}
                    </p>
                    <p className="text-sm text-gray-500">Deals</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {property._count.tasks}
                    </p>
                    <p className="text-sm text-gray-500">Tasks</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {property._count.notes}
                    </p>
                    <p className="text-sm text-gray-500">Notes</p>
                  </div>
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
                <p className="text-sm text-gray-700 font-mono">{property.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Tenant ID
                </label>
                <p className="text-sm text-gray-700 font-mono">
                  {property.tenantId}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Criado em
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-700">
                    {new Date(property.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Atualizado em
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-700">
                    {new Date(property.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
