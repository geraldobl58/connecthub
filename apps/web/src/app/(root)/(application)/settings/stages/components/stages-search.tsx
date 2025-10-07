"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStageUrlFilters } from "@/hooks/use-stage-url-filters";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface para os valores do formulário
interface StagesSearchValues {
  search: string;
  type: string;
  status: string;
}

interface StagesSearchProps {
  onSearchSuccess?: () => void;
}

export const StagesSearch = ({ onSearchSuccess }: StagesSearchProps) => {
  const router = useRouter();
  const urlFilters = useStageUrlFilters();

  // Configurar React Hook Form
  const form = useForm<StagesSearchValues>({
    defaultValues: {
      search: urlFilters.search || "",
      type: urlFilters.type || "",
      status: getStatusFromFilters(urlFilters),
    },
  });

  // Função para converter filtros para status
  function getStatusFromFilters(filters: any): string {
    if (filters.isWon === true) return "won";
    if (filters.isLost === true) return "lost";
    if (filters.isWon === false && filters.isLost === false) return "active";
    return "";
  }

  // Sincronizar form com os filtros da URL
  useEffect(() => {
    form.reset({
      search: urlFilters.search || "",
      type: urlFilters.type || "",
      status: getStatusFromFilters(urlFilters),
    });
  }, [urlFilters, form]);

  // Função para submeter o formulário (busca)
  const onSubmit = useCallback(
    (values: StagesSearchValues) => {
      // Verificar se pelo menos um campo está preenchido
      const hasSearchTerm = values.search && values.search.trim();
      const hasTypeFilter =
        values.type && values.type !== "all" && values.type !== "";
      const hasStatusFilter =
        values.status && values.status !== "all" && values.status !== "";

      if (!hasSearchTerm && !hasTypeFilter && !hasStatusFilter) {
        toast.error(
          "Por favor, preencha pelo menos um campo para realizar a busca"
        );
        return;
      }

      const params = new URLSearchParams();

      // Adicionar parâmetros apenas se tiverem valor e não forem "all"
      if (hasSearchTerm) {
        params.set("search", values.search.trim());
      }
      if (hasTypeFilter) {
        params.set("type", values.type);
      }
      if (hasStatusFilter) {
        // Converter status para filtros booleanos
        if (values.status === "won") {
          params.set("isWon", "true");
        } else if (values.status === "lost") {
          params.set("isLost", "true");
        } else if (values.status === "active") {
          params.set("isWon", "false");
          params.set("isLost", "false");
        }
      }

      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : "";
      router.push(`/settings/stages${newURL}`, { scroll: false });
      onSearchSuccess?.();
    },
    [router, onSearchSuccess]
  );

  // Função para limpar filtros
  const handleClear = useCallback(() => {
    form.reset({
      search: "",
      type: "",
      status: "",
    });
    router.push("/settings/stages", { scroll: false });
    onSearchSuccess?.();
  }, [form, router, onSearchSuccess]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-between gap-4"
      >
        {/* Campo de busca */}
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Buscar por nome do stage..."
                    className="pl-10 w-full"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Select de tipo */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="SALES">Vendas</SelectItem>
                  <SelectItem value="SUPPORT">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Select de status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="won">Ganho</SelectItem>
                  <SelectItem value="lost">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Botões */}
        <div className="flex gap-2">
          <Button type="submit">
            <Search className="h-4 w-4" />
            Buscar
          </Button>

          <Button type="button" variant="destructive" onClick={handleClear}>
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
};
