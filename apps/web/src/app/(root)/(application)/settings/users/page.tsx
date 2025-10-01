import { Plus } from "lucide-react";
import Link from "next/link";

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
          <Button asChild>
            <Link href="/settings/users/create">
              <Plus className="h-4 w-4" />
              <span>Criar Usuário</span>
            </Link>
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
