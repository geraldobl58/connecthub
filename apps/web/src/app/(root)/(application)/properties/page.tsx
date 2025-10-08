"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { PropertiesList } from "./components/properties-list";

const PropertiesPage = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleCreateProperty = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem criar propriedades.",
      });
      return;
    }
    router.push("/properties/new");
  };

  return (
    <>
      <Header
        title="Propriedades"
        description="Gerencie as propriedades imobiliárias"
        content={
          <Button
            onClick={handleCreateProperty}
            disabled={!isAdmin}
            title={
              !isAdmin ? "Apenas administradores podem criar propriedades" : ""
            }
          >
            <Plus className="h-4 w-4" />
            <span>Criar Propriedade</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <PropertiesList />
      </div>
    </>
  );
};

export default PropertiesPage;
