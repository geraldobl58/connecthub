import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import { ClientsList } from "@/features/clients/components/clients-list";

const ClientPage = () => {
  return (
    <>
      <HeaderContainer
        title="Gerenciamento de Clientes"
        subtitle="Administre os clientes da sua plataforma"
        content={
          <>
            <ProfileHeader />
          </>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <ClientsList />
      </div>
    </>
  );
};

export default ClientPage;
