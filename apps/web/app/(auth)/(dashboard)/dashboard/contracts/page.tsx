import { DataTable } from "@/components/data-table";
import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import { columns, Payment } from "@/features/contracts/components/columns";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

const ContractsPage = async () => {
  const data = await getData();

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
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default ContractsPage;
