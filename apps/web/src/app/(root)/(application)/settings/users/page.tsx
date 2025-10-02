"use client";

import { Plus } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { UsersList } from "./components/users-list";
import { useState } from "react";
import { UsersFormDialog } from "@/app/(root)/(application)/settings/users/components/users-form-dialog";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

const UsersPage = () => {
  const [isCreateAndUpdateUserDialogOpen, setIsCreateAndUpdateUserDialogOpen] =
    useState(false);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleCreateAndUpdateUser = () => {
    if (!isAdmin) {
      toast.error("Acesso Negado", {
        description: "Apenas administradores podem criar usuários.",
      });
      return;
    }
    setIsCreateAndUpdateUserDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Usuários"
        description="Gerencie os usuários do sistema"
        content={
          <Button
            onClick={handleCreateAndUpdateUser}
            disabled={!isAdmin}
            title={
              !isAdmin ? "Apenas administradores podem criar usuários" : ""
            }
          >
            <Plus className="h-4 w-4" />
            <span>Criar Usuário</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <UsersList />
      </div>
      <UsersFormDialog
        isOpen={isCreateAndUpdateUserDialogOpen}
        onClose={() => setIsCreateAndUpdateUserDialogOpen(false)}
      />
    </>
  );
};

export default UsersPage;
