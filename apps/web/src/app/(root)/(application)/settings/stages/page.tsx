"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { StagesList } from "./components/stages-list";
import { StagesFormDialog } from "./components/stages-form-dialog";

const StagesPage = () => {
  const [
    isCreateAndUpdateStageDialogOpen,
    setIsCreateAndUpdateStageDialogOpen,
  ] = useState(false);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleCreateAndUpdateStage = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem criar stages.",
      });
      return;
    }
    setIsCreateAndUpdateStageDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Stages"
        description="Gerencie os estágios do pipeline de vendas"
        content={
          <Button
            onClick={handleCreateAndUpdateStage}
            disabled={!isAdmin}
            title={!isAdmin ? "Apenas administradores podem criar stages" : ""}
          >
            <Plus className="h-4 w-4" />
            <span>Criar Stage</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <StagesList />
      </div>
      <StagesFormDialog
        isOpen={isCreateAndUpdateStageDialogOpen}
        onClose={() => setIsCreateAndUpdateStageDialogOpen(false)}
        onSuccess={() => setIsCreateAndUpdateStageDialogOpen(false)}
      />
    </>
  );
};

export default StagesPage;
