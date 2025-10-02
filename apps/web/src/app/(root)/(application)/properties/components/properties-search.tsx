"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
} from "@/schemas/property";

interface PropertiesSearchValues {
  search: string;
  type: string;
  status: string;
}

interface PropertiesSearchProps {
  onSearchSuccess?: () => void;
}

export const PropertiesSearch = ({
  onSearchSuccess,
}: PropertiesSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Configurar React Hook Form
  const form = useForm<PropertiesSearchValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      type: searchParams.get("type") || "",
      status: searchParams.get("status") || "",
    },
  });

  // Sincronizar form com os filtros da URL
  useEffect(() => {
    form.reset({
      search: searchParams.get("search") || "",
      type: searchParams.get("type") || "",
      status: searchParams.get("status") || "",
    });
  }, [searchParams, form]);

  // Função para submeter o formulário (busca)
  const onSubmit = useCallback(
    (values: PropertiesSearchValues) => {
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
        params.set("status", values.status);
      }

      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : "";
      router.push(`/settings/properties${newURL}`, { scroll: false });
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
    router.push("/settings/properties", { scroll: false });
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
                    placeholder="Buscar por título, código ou descrição..."
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
                  {Object.entries(PROPERTY_TYPE_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
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
                  {Object.entries(PROPERTY_STATUS_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Botões */}
        <div className="flex gap-2">
          <Button type="submit">
            <SearchIcon className="h-4 w-4" />
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
