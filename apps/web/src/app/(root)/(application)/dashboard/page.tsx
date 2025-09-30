import { Header } from "@/components/header";
import { Information } from "./components/information";

const DashboardPage = () => {
  return (
    <>
      <Header title="Dashboard" description="Bem-vindo ao painel de controle" />
      <Information />
    </>
  );
};

export default DashboardPage;
