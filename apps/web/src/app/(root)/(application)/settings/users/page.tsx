import { Plus } from "lucide-react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { UsersList } from "./components/users-list";

const UsersPage = () => {
  return (
    <>
      <Header
        title="Usuários"
        description="Gerencie os usuários do sistema"
        content={
          <Button>
            <Plus className="h-4 w-4" />
            <span>Criar Usuário</span>
          </Button>
        }
      />
      <div className="container mx-auto p-6 space-y-6">
        <UsersList />
      </div>
    </>
  );
};

export default UsersPage;
