"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface para os valores do formulário
interface UsersSearchValues {
  search: string;
  role: string;
  isActive: string;
}

interface UsersSearchProps {
  onSearchSuccess?: () => void;
}

export const UsersSearch = ({ onSearchSuccess }: UsersSearchProps) => {
  const router = useRouter();
  const urlFilters = useUrlFilters();

  // Configurar React Hook Form
  const form = useForm<UsersSearchValues>({
    defaultValues: {
      search: urlFilters.search || "",
      role: urlFilters.role || "",
      isActive: urlFilters.isActive !== undefined ? String(urlFilters.isActive) : "",
    },
  });

  // Sincronizar form com os filtros da URL
  useEffect(() => {
    form.reset({
      search: urlFilters.search || "",
      role: urlFilters.role || "",
      isActive: urlFilters.isActive !== undefined ? String(urlFilters.isActive) : "",
    });
  }, [urlFilters, form]);

  // Função para submeter o formulário (busca)
  const onSubmit = useCallback(
    (values: UsersSearchValues) => {
      const params = new URLSearchParams();

      // Adicionar parâmetros apenas se tiverem valor e não forem "all"
      if (values.search && values.search.trim()) {
        params.set("search", values.search.trim());
      }
      if (values.role && values.role !== "all" && values.role !== "") {
        params.set("role", values.role);
      }
      if (values.isActive && values.isActive !== "all" && values.isActive !== "") {
        params.set("isActive", values.isActive);
      }

      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : "";
      router.push(`/settings/users${newURL}`, { scroll: false });
      onSearchSuccess?.();
    },
    [router, onSearchSuccess]
  );

  // Função para limpar filtros
  const handleClear = useCallback(() => {
    form.reset({
      search: "",
      role: "",
      isActive: "",
    });
    router.push("/settings/users", { scroll: false });
    onSearchSuccess?.();
  }, [form, router, onSearchSuccess]);

  // Removido: handleSelectChange para não filtrar automaticamente

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
                    placeholder="Buscar por nome ou email..."
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

        {/* Select de cargo */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os cargos</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="MANAGER">Gerente</SelectItem>
                  <SelectItem value="AGENT">Agente</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Select de status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
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
