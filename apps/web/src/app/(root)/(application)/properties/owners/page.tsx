"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { OwnersList } from "./components/owners-list";
import { OwnerFormDialog } from "./components/owner-form-dialog";

const OwnersPage = () => {
  const [
    isCreateAndUpdateOwnerDialogOpen,
    setIsCreateAndUpdateOwnerDialogOpen,
  ] = useState(false);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleCreateAndUpdateOwner = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem criar proprietários.",
      });
      return;
    }
    setIsCreateAndUpdateOwnerDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Proprietários"
        description="Gerencie os proprietários de imóveis"
        content={
          <Button
            onClick={handleCreateAndUpdateOwner}
            disabled={!isAdmin}
            title={
              !isAdmin ? "Apenas administradores podem criar proprietários" : ""
            }
          >
            <Plus className="h-4 w-4" />
            <span>Criar Proprietário</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <OwnersList />
      </div>
      <OwnerFormDialog
        isOpen={isCreateAndUpdateOwnerDialogOpen}
        onClose={() => setIsCreateAndUpdateOwnerDialogOpen(false)}
        onSuccess={() => setIsCreateAndUpdateOwnerDialogOpen(false)}
      />
    </>
  );
};

export default OwnersPage;
