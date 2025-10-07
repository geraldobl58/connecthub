"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { OwnerListParams } from "@/types/owners";

// Interface para os valores do formulário
interface OwnersSearchValues {
  search: string;
}

interface OwnersSearchProps {
  onSearchChange: (params: OwnerListParams) => void;
  onSearchSuccess?: () => void;
}

export const OwnersSearch = ({
  onSearchChange,
  onSearchSuccess,
}: OwnersSearchProps) => {
  // Configurar React Hook Form
  const form = useForm<OwnersSearchValues>({
    defaultValues: {
      search: "",
    },
  });

  const { watch, reset } = form;
  const searchValue = watch("search");

  const handleSearch = useCallback(() => {
    const searchTerm = searchValue?.trim();

    onSearchChange({
      search: searchTerm || undefined,
      page: 1,
      limit: 20,
    });

    if (onSearchSuccess) {
      onSearchSuccess();
    }

    if (searchTerm) {
      toast.success(`Buscando por: "${searchTerm}"`);
    }
  }, [searchValue, onSearchChange, onSearchSuccess]);

  const handleClear = useCallback(() => {
    reset({ search: "" });
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

  const hasActiveFilters = searchValue && searchValue.trim().length > 0;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
                        placeholder="Buscar por nome, email ou telefone..."
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
        </div>
      </Form>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <span>Busca:</span>
            <span className="font-medium">"{searchValue}"</span>
            <button
              onClick={() => form.setValue("search", "")}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
