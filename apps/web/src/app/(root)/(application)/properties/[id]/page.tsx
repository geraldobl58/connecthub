"use client";

import { useRouter, useParams } from "next/navigation";
import { useProperty } from "@/hooks/use-properties";
import { Header } from "@/components/header";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useAuth } from "@/hooks/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const PropertyViewPage = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const { data: property, isLoading } = useProperty(propertyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Propriedade não encontrada</p>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    RESERVED: "Reservado",
    SOLD: "Vendido",
    RENTED: "Alugado",
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    RESERVED: "bg-yellow-100 text-yellow-800",
    SOLD: "bg-red-100 text-red-800",
    RENTED: "bg-blue-100 text-blue-800",
  };

  const typeLabels: Record<string, string> = {
    HOUSE: "Casa",
    APARTMENT: "Apartamento",
    CONDO: "Cobertura",
    LAND: "Terreno",
    COMMERCIAL: "Comercial",
  };

  return (
    <>
      <Header
        title={property.title}
        description={`Código: ${property.code}`}
        content={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/properties")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            {isAdmin && (
              <Button
                onClick={() => router.push(`/properties/${propertyId}/edit`)}
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </Button>
            )}
          </div>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        {/* Cover Image */}
        {property.coverImage && (
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <Image
              width={10000}
              height={10000}
              src={property.coverImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Status e Tipo */}
        <div className="flex gap-2">
          <Badge className={statusColors[property.status]}>
            {statusLabels[property.status]}
          </Badge>
          <Badge variant="outline">{typeLabels[property.type]}</Badge>
        </div>

        {/* Grid com informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.description && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Descrição
                  </h4>
                  <p className="text-sm">{property.description}</p>
                </div>
              )}

              {/* Características */}
              <div className="grid grid-cols-2 gap-4">
                {property.bedroom !== undefined && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {property.bedroom}{" "}
                      {property.bedroom === 1 ? "Quarto" : "Quartos"}
                    </span>
                  </div>
                )}
                {property.bathroom !== undefined && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {property.bathroom}{" "}
                      {property.bathroom === 1 ? "Banheiro" : "Banheiros"}
                    </span>
                  </div>
                )}
                {property.parking !== undefined && (
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {property.parking}{" "}
                      {property.parking === 1 ? "Vaga" : "Vagas"}
                    </span>
                  </div>
                )}
                {property.area !== undefined && (
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.area} m²</span>
                  </div>
                )}
              </div>

              {/* Proprietário */}
              {property.owner && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Proprietário
                  </h4>
                  <p className="text-sm">{property.owner.name}</p>
                  {property.owner.email && (
                    <p className="text-xs text-muted-foreground">
                      {property.owner.email}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preços e Endereço */}
          <div className="space-y-6">
            {/* Preços */}
            <Card>
              <CardHeader>
                <CardTitle>Preços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.price !== undefined && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Preço
                    </h4>
                    <p className="text-2xl font-bold text-primary">
                      R$ {property.price.toLocaleString("pt-BR")}
                    </p>
                  </div>
                )}
                {(property.minPrice !== undefined ||
                  property.maxPrice !== undefined) && (
                  <div className="flex gap-4 text-sm">
                    {property.minPrice !== undefined && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground">
                          Mínimo
                        </h4>
                        <p>R$ {property.minPrice.toLocaleString("pt-BR")}</p>
                      </div>
                    )}
                    {property.maxPrice !== undefined && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground">
                          Máximo
                        </h4>
                        <p>R$ {property.maxPrice.toLocaleString("pt-BR")}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Endereço */}
            {property.address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <address className="not-italic text-sm space-y-1">
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
                    {property.address.city && property.address.state && (
                      <p>
                        {property.address.city}, {property.address.state}
                      </p>
                    )}
                    {property.address.zip && <p>CEP: {property.address.zip}</p>}
                  </address>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Galeria de Imagens */}
        {property.galleryImages && property.galleryImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      width={300}
                      height={300}
                      src={image}
                      alt={`${property.title} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default PropertyViewPage;
