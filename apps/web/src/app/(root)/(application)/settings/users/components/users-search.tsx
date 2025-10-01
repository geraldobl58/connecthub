"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersSearchProps {
  onSearchSuccess?: () => void;
}

export const UsersSearch = ({ onSearchSuccess }: UsersSearchProps) => {
  const router = useRouter();
  const urlFilters = useUrlFilters();

  // Valores atuais dos filtros
  const search = urlFilters.search || "";
  const role = urlFilters.role || "";
  const isActive = urlFilters.isActive !== undefined ? String(urlFilters.isActive) : "";

  const updateFilters = useCallback((newFilters: Record<string, string>) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : "";
    router.push(`/settings/users${newURL}`, { scroll: false });
    onSearchSuccess?.();
  }, [router, onSearchSuccess]);

  const handleSearch = useCallback((searchValue: string) => {
    updateFilters({
      search: searchValue,
      role,
      isActive,
    });
  }, [role, isActive, updateFilters]);

  const handleRoleChange = useCallback((roleValue: string) => {
    updateFilters({
      search,
      role: roleValue,
      isActive,
    });
  }, [search, isActive, updateFilters]);

  const handleStatusChange = useCallback((statusValue: string) => {
    updateFilters({
      search,
      role,
      isActive: statusValue,
    });
  }, [search, role, updateFilters]);

  const handleClear = useCallback(() => {
    router.push("/settings/users", { scroll: false });
    onSearchSuccess?.();
  }, [router, onSearchSuccess]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 w-full"
        />
      </div>

      <Select value={role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Cargo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os cargos</SelectItem>
          <SelectItem value="ADMIN">Administrador</SelectItem>
          <SelectItem value="MANAGER">Gerente</SelectItem>
          <SelectItem value="AGENT">Agente</SelectItem>
          <SelectItem value="VIEWER">Visualizador</SelectItem>
        </SelectContent>
      </Select>

      <Select value={isActive} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="true">Ativo</SelectItem>
          <SelectItem value="false">Inativo</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button variant="destructive" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
