"use client";

import { useRouter, useParams } from "next/navigation";
import { PropertyForm } from "../../components/property-form";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperty } from "@/hooks/use-properties";
import { LoadingSpinner } from "@/components/common/loading-spinner";

const EditPropertyPage = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

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

  return (
    <>
      <Header
        title="Editar Propriedade"
        description="Atualize as informações da propriedade"
        content={
          <Button variant="outline" onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6">
        <PropertyForm
          mode="edit"
          property={property}
          onSuccess={() => router.push("/properties")}
          onCancel={() => router.push("/properties")}
        />
      </div>
    </>
  );
};

export default EditPropertyPage;
