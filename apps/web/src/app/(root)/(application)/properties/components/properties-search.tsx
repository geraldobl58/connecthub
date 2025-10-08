"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { PropertyListParams } from "@/types/properties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Interface para os valores do formulário
interface PropertiesSearchValues {
  search: string;
  type: string;
  status: string;
  ownerId: string;
  priceRange: [number, number];
}

interface PropertiesSearchProps {
  onSearchChange: (params: PropertyListParams) => void;
  onSearchSuccess?: () => void;
}

export const PropertiesSearch = ({
  onSearchChange,
  onSearchSuccess,
}: PropertiesSearchProps) => {
  // Configurar React Hook Form
  const form = useForm<PropertiesSearchValues>({
    defaultValues: {
      search: "",
      type: "all",
      status: "all",
      ownerId: "all",
      priceRange: [0, 5000000],
    },
  });

  const { watch, reset } = form;
  const searchValue = watch("search");
  const typeValue = watch("type");
  const statusValue = watch("status");
  const ownerIdValue = watch("ownerId");
  const priceRangeValue = watch("priceRange");

  const handleSearch = useCallback(() => {
    const searchTerm = searchValue?.trim();
    const type = typeValue && typeValue !== "all" ? typeValue : undefined;
    const status =
      statusValue && statusValue !== "all" ? statusValue : undefined;
    const ownerId =
      ownerIdValue && ownerIdValue !== "all" ? ownerIdValue : undefined;
    const minPrice = priceRangeValue[0] > 0 ? priceRangeValue[0] : undefined;
    const maxPrice = priceRangeValue[1] < 5000000 ? priceRangeValue[1] : undefined;

    onSearchChange({
      search: searchTerm || undefined,
      type: type as
        | "HOUSE"
        | "APARTMENT"
        | "CONDO"
        | "LAND"
        | "COMMERCIAL"
        | undefined,
      status: status as
        | "ACTIVE"
        | "INACTIVE"
        | "RESERVED"
        | "SOLD"
        | "RENTED"
        | undefined,
      ownerId,
      minPrice,
      maxPrice,
      page: 1,
      limit: 20,
    });

    if (onSearchSuccess) {
      onSearchSuccess();
    }

    if (searchTerm || type || status || ownerId || minPrice || maxPrice) {
      toast.success("Filtros aplicados com sucesso!");
    }
  }, [
    searchValue,
    typeValue,
    statusValue,
    ownerIdValue,
    priceRangeValue,
    onSearchChange,
    onSearchSuccess,
  ]);

  const handleClear = useCallback(() => {
    reset({
      search: "",
      type: "all",
      status: "all",
      ownerId: "all",
      priceRange: [0, 5000000],
    });
    onSearchChange({
      page: 1,
      limit: 20,
    });

    if (onSearchSuccess) {
      onSearchSuccess();
    }

    toast.success("Filtros limpos");
  }, [reset, onSearchChange, onSearchSuccess]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const hasActiveFilters =
    (searchValue && searchValue.trim().length > 0) ||
    (typeValue && typeValue !== "all") ||
    (statusValue && statusValue !== "all") ||
    (ownerIdValue && ownerIdValue !== "all") ||
    priceRangeValue[0] > 0 ||
    priceRangeValue[1] < 5000000;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        {...field}
                        placeholder="Buscar por código, título ou descrição..."
                        className="pl-10 pr-10"
                        onKeyPress={handleKeyPress}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="HOUSE">Casa</SelectItem>
                      <SelectItem value="APARTMENT">Apartamento</SelectItem>
                      <SelectItem value="CONDO">Cobertura</SelectItem>
                      <SelectItem value="LAND">Terreno</SelectItem>
                      <SelectItem value="COMMERCIAL">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                      <SelectItem value="RESERVED">Reservado</SelectItem>
                      <SelectItem value="SOLD">Vendido</SelectItem>
                      <SelectItem value="RENTED">Alugado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Faixa de Preço</span>
                        <span className="font-medium text-foreground">
                          R$ {field.value[0].toLocaleString('pt-BR')} - R$ {field.value[1].toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={5000000}
                        step={50000}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSearch}
            variant="default"
            className="px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="px-6"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </Form>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <span>Busca:</span>
              <span className="font-medium">&quot;{searchValue}&quot;</span>
              <button
                onClick={() => form.setValue("search", "")}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {typeValue && typeValue !== "all" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span>Tipo:</span>
              <span className="font-medium">{typeValue}</span>
              <button
                onClick={() => form.setValue("type", "all")}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {statusValue && statusValue !== "all" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              <span>Status:</span>
              <span className="font-medium">{statusValue}</span>
              <button
                onClick={() => form.setValue("status", "all")}
                className="text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {(priceRangeValue[0] > 0 || priceRangeValue[1] < 5000000) && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <span>Preço:</span>
              <span className="font-medium">
                R$ {priceRangeValue[0].toLocaleString('pt-BR')} - R$ {priceRangeValue[1].toLocaleString('pt-BR')}
              </span>
              <button
                onClick={() => form.setValue("priceRange", [0, 5000000])}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
