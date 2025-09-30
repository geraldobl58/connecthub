import { Header } from "@/components/header";
import { Information } from "./components/information";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const DashboardPage = () => {
  return (
    <>
      <Header
        title="Dashboard"
        description="Bem-vindo ao painel de controle"
        content={
          <Button variant="outline">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        }
      />
      <Information />
    </>
  );
};

export default DashboardPage;
