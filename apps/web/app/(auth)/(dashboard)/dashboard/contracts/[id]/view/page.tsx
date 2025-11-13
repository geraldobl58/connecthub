import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import { ContractView } from "@/features/contracts/components/contract-view";

interface ContractViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ContractViewPage = async ({ params }: ContractViewPageProps) => {
  const { id } = await params;

  return (
    <>
      <HeaderContainer
        title="Gerenciamento de Contratos"
        subtitle="Administre os Contratos da sua plataforma"
        content={<ProfileHeader />}
      />

      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <ContractView contractId={id} />
        </div>
      </div>
    </>
  );
};

export default ContractViewPage;
