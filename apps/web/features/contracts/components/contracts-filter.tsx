import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Search, X } from "lucide-react";

import { ContractsQueryParams } from "../schemas/contract";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContractsFilterProps {
  onSearch: (search: string) => void;
  isLoading: boolean;
}

export const ContractsFilter = ({
  onSearch,
  isLoading,
}: ContractsFilterProps) => {
  const searchParams = useSearchParams();

  const { register, handleSubmit, reset, setValue } =
    useForm<ContractsQueryParams>({
      defaultValues: {
        search: searchParams.get("search") || "",
      },
    });

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setValue("search", searchFromUrl);
  }, [searchParams, setValue]);

  const onSubmit = (data: ContractsQueryParams) => {
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
          placeholder="Buscar contratos por nome"
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
