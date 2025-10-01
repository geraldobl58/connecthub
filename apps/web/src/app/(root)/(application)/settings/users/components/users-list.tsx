import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useUsers } from "@/hooks/use-users";

export const UsersList = () => {
  const { users, isLoading, error } = useUsers();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-500 mt-1">Gerencie os usuários do sistema</p>
      </div>
      <div>
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};
