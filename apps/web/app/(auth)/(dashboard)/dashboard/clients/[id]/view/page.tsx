import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import { ClientView } from "@/features/clients/components/client-view";

interface ClientViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ClientViewPage = async ({ params }: ClientViewPageProps) => {
  const { id } = await params;

  return (
    <>
      <HeaderContainer
        title="Gerenciamento de Clientes"
        subtitle="Administre os clientes da sua plataforma"
        content={<ProfileHeader />}
      />

      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <ClientView clientId={id} />
        </div>
      </div>
    </>
  );
};

export default ClientViewPage;
