"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, X } from "lucide-react";
import { UserListParams } from "@/types/users";
import { Role } from "@/types/permissions";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useUrlManager } from "@/hooks/use-url-manager";

export const UsersSearch = () => {
  const urlFilters = useUrlFilters();
  const { updateURL } = useUrlManager();

  const [filters, setFilters] = useState<UserListParams>({
    search: urlFilters.search || "",
    role: urlFilters.role,
    isActive: urlFilters.isActive,
    page: urlFilters.page,
    limit: urlFilters.limit,
  });

  // Atualizar filtros quando a URL mudar
  useEffect(() => {
    setFilters({
      search: urlFilters.search || "",
      role: urlFilters.role,
      isActive: urlFilters.isActive,
      page: urlFilters.page,
      limit: urlFilters.limit,
    });
  }, [urlFilters]);

  const handleSearch = () => {
    // Resetar para página 1 ao aplicar filtros
    const searchFilters = {
      ...filters,
      page: 1,
    };
    updateURL(searchFilters);
  };

  const handleClear = () => {
    const clearedFilters: UserListParams = {
      search: "",
      role: undefined,
      isActive: undefined,
      page: 1, // Resetar para página 1 ao limpar filtros
      limit: undefined,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={filters.search || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          onKeyPress={handleKeyPress}
          className="pl-10 w-full"
        />
      </div>

      <Select
        value={filters.role || "all"}
        onValueChange={(value) => {
          const newRole = value === "all" ? undefined : (value as Role);
          setFilters((prev) => ({
            ...prev,
            role: newRole,
          }));
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Todos os cargos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os cargos</SelectItem>
          <SelectItem value="ADMIN">Administrador</SelectItem>
          <SelectItem value="MANAGER">Gerente</SelectItem>
          <SelectItem value="AGENT">Agente</SelectItem>
          <SelectItem value="VIEWER">Visualizador</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          filters.isActive === undefined ? "all" : filters.isActive.toString()
        }
        onValueChange={(value) => {
          const newIsActive = value === "all" ? undefined : value === "true";
          setFilters((prev) => ({
            ...prev,
            isActive: newIsActive,
          }));
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="true">Ativo</SelectItem>
          <SelectItem value="false">Inativo</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button onClick={handleSearch}>
          <SearchIcon className="h-4 w-4" />
        </Button>
        <Button variant="destructive" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
