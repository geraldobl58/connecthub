"use client";

import Link from "next/link";

import { Plus } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { PropertiesList } from "./components/properties-list";
import { useAuth } from "@/hooks/auth";

const PropertiesPage = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const isManager = currentUser?.role === "MANAGER";
  const canCreate = isAdmin || isManager;

  return (
    <>
      <Header
        title="Propriedades"
        description="Gerencie as propriedades do sistema"
        content={
          <Button
            asChild
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
    </>
  );
};

export default PropertiesPage;
