"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  User,
  Calendar,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { useProperty } from "@/hooks/use-properties";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
} from "@/schemas/property";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyViewPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  // Buscar dados da propriedade
  const { property, isLoading: isFetchingProperty } = useProperty(propertyId);

  // Usar mídias da propriedade (já vêm com URLs absolutas)
  const media = property?.media || [];

  const isLoading = isFetchingProperty;

  // Formatar preço
  const formatPrice = (price?: number) => {
    if (!price) return "Preço não informado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Formatar área
  const formatArea = (area?: number) => {
    if (!area) return "Não informado";
    return `${area.toLocaleString("pt-BR")} m²`;
  };

  // Formatar data
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Imagens */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" />
              ))}
            </div>
          </div>

          {/* Detalhes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Propriedade não encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            A propriedade que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Propriedades
          </Button>
        </div>
      </div>
    );
  }

  const coverImage = media.find((m) => m.isCover) || media[0];
  const otherImages = media.filter((m) => m.id !== coverImage?.id);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Código: {property.code}</span>
            <span>•</span>
            <Badge
              variant={property.status === "ACTIVE" ? "default" : "secondary"}
            >
              {PROPERTY_STATUS_LABELS[property.status]}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/properties/${propertyId}`)}
          >
            Editar
          </Button>
          <Button onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagens */}
        <div className="lg:col-span-2 space-y-4">
          {media.length > 0 ? (
            <>
              {/* Imagem principal */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  <img
                    src={coverImage?.url || media[0]?.url}
                    alt={coverImage?.alt || property.title}
                    className="w-full h-full object-cover"
                  />
                  {coverImage?.isCover && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Imagem de Capa
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Miniaturas */}
              {otherImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {otherImages.slice(0, 3).map((image) => (
                    <Card
                      key={image.id}
                      className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => {
                        /* TODO: Implement image selection */
                      }}
                    >
                      <div className="aspect-video relative bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.alt || property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Card>
                  ))}
                  {media.length > 4 && (
                    <Card className="overflow-hidden">
                      <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">
                            +{media.length - 4} mais
                          </span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhuma imagem disponível</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Detalhes */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tipo</span>
                <Badge variant="outline">
                  {PROPERTY_TYPE_LABELS[property.type]}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Preço</span>
                <span className="font-semibold text-green-600">
                  {formatPrice(property.price)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Área</span>
                <span className="text-sm">{formatArea(property.area)}</span>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Bed className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-lg font-semibold">
                    {property.bedroom || 0}
                  </div>
                  <div className="text-xs text-gray-500">Quartos</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Bath className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-lg font-semibold">
                    {property.bathroom || 0}
                  </div>
                  <div className="text-xs text-gray-500">Banheiros</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Car className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-lg font-semibold">
                    {property.parking || 0}
                  </div>
                  <div className="text-xs text-gray-500">Vagas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          {property.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Endereço:</span>
                  <p className="text-sm text-gray-600">
                    {property.address.street}
                    {property.address.number && `, ${property.address.number}`}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Bairro:</span>
                  <p className="text-sm text-gray-600">
                    {property.address.district}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Cidade:</span>
                  <p className="text-sm text-gray-600">
                    {property.address.city} - {property.address.state}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">CEP:</span>
                  <p className="text-sm text-gray-600">
                    {property.address.zip}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Características */}
          {property.features && Object.keys(property.features).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(property.features).map(([key, value]) => (
                    <Badge key={key} variant="secondary">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Criado em:</span>
                <span className="text-sm text-gray-600">
                  {formatDate(property.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Última atualização:</span>
                <span className="text-sm text-gray-600">
                  {formatDate(property.updatedAt)}
                </span>
              </div>
              {property.ownerId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Proprietário:</span>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      ID: {property.ownerId}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Descrição */}
      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
