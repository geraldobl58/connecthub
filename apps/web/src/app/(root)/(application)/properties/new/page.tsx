"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "../components/property-form";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewPropertyPage = () => {
  const router = useRouter();

  return (
    <>
      <Header
        title="Nova Propriedade"
        description="Preencha os dados para criar uma nova propriedade"
        content={
          <Button variant="outline" onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6">
        <PropertyForm
          mode="create"
          onSuccess={() => router.push("/properties")}
          onCancel={() => router.push("/properties")}
        />
      </div>
    </>
  );
};

export default NewPropertyPage;
