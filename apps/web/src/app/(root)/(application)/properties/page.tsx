"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { PropertiesList } from "./components/properties-list";
import { PropertyFormDialog } from "./components/property-form-dialog";

const PropertiesPage = () => {
  const [
    isCreateAndUpdatePropertyDialogOpen,
    setIsCreateAndUpdatePropertyDialogOpen,
  ] = useState(false);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleCreateAndUpdateProperty = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem criar propriedades.",
      });
      return;
    }
    setIsCreateAndUpdatePropertyDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Propriedades"
        description="Gerencie as propriedades imobiliárias"
        content={
          <Button
            onClick={handleCreateAndUpdateProperty}
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
      <PropertyFormDialog
        isOpen={isCreateAndUpdatePropertyDialogOpen}
        onClose={() => setIsCreateAndUpdatePropertyDialogOpen(false)}
        onSuccess={() => setIsCreateAndUpdatePropertyDialogOpen(false)}
      />
    </>
  );
};

export default PropertiesPage;
