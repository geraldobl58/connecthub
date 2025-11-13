import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import { ContractsList } from "@/features/contracts/components/contracts-list";

const ContractsPage = async () => {
  return (
    <>
      <HeaderContainer
        title="Gerenciamento de Contratos"
        subtitle="Visão geral da sua conta e atividades recentes."
        content={
          <>
            <ProfileHeader />
          </>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <ContractsList />
      </div>
    </>
  );
};

export default ContractsPage;
