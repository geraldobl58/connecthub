"use client";

import { Plus } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { PropertiesList } from "./components/properties-list";
import { useState } from "react";
import { PropertiesFormDialog } from "./components/properties-form-dialog";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import Link from "next/link";

const PropertiesPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const isManager = currentUser?.role === "MANAGER";
  const canCreate = isAdmin || isManager;

  const handleCreateProperty = () => {
    if (!canCreate) {
      toast.error("Acesso Negado", {
        description:
          "Apenas administradores e gerentes podem criar propriedades.",
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <>
      <Header
        title="Propriedades"
        description="Gerencie as propriedades do sistema"
        content={
          <Button
            asChild
            onClick={handleCreateProperty}
            disabled={!canCreate}
            title={
              !canCreate
                ? "Apenas administradores e gerentes podem criar propriedades"
                : ""
            }
          >
            <Link href="/properties/new">
              <Plus className="h-4 w-4" />
              <span>Criar Propriedade</span>
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <PropertiesList />
      </div>
      <PropertiesFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default PropertiesPage;
