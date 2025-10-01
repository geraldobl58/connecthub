"use client";

import { useState, useCallback, useEffect } from "react";
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

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");

  // Sincronizar com os filtros da URL
  useEffect(() => {
    setSearch(urlFilters.search || "");
    setRole(urlFilters.role || "");
    setIsActive(urlFilters.isActive !== undefined ? String(urlFilters.isActive) : "");
  }, [urlFilters]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }
    if (role && role !== "all") {
      params.set("role", role);
    }
    if (isActive && isActive !== "all") {
      params.set("isActive", isActive);
    }

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : "";
    router.push(`/settings/users${newURL}`, { scroll: false });
    onSearchSuccess?.();
  }, [search, role, isActive, router, onSearchSuccess]);

  const handleClear = useCallback(() => {
    setSearch("");
    setRole("");
    setIsActive("");
    router.push("/settings/users", { scroll: false });
    onSearchSuccess?.();
  }, [router, onSearchSuccess]);

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 w-full"
        />
      </div>

      <Select value={role} onValueChange={(value) => setRole(value)}>
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

      <Select value={isActive} onValueChange={(value) => setIsActive(value)}>
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
