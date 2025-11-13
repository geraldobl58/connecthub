import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Search, X } from "lucide-react";

import { ClientsQueryParams } from "../schemas/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientsFilterProps {
  onSearch: (search: string) => void;
  isLoading: boolean;
}

export const ClientsFilter = ({ onSearch, isLoading }: ClientsFilterProps) => {
  const searchParams = useSearchParams();
  const { register, handleSubmit, reset, setValue } =
    useForm<ClientsQueryParams>({
      defaultValues: {
        search: searchParams.get("search") || "",
      },
    });

  // Atualizar campo quando URL mudar
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setValue("search", searchFromUrl);
  }, [searchParams, setValue]);

  const onSubmit = (data: ClientsQueryParams) => {
    if (data.search) {
      onSearch(data.search);
    }
  };

  const resetForm = () => {
    reset({ search: "" });
    onSearch("");
  };

  return (
    <div className="flex gap-2 justify-between items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-1">
        <Input
          placeholder="Buscar cliente por nome, email ou bairro..."
          disabled={isLoading}
          className="max-w-md"
          {...register("search")}
        />

        <Button type="submit" disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" /> Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={resetForm}
        >
          <X className="w-4 h-4 mr-2" /> Limpar
        </Button>
      </form>
    </div>
  );
};
