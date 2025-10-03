"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User, Building, Search, X, Loader2, Check } from "lucide-react";
import { useOwners, Owner } from "@/hooks/use-owners";
import { toast } from "sonner";

interface PropertyOwnerProps {
  ownerId?: string;
  onChange: (ownerId: string | undefined) => void;
}

export function PropertyOwner({ ownerId, onChange }: PropertyOwnerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [isCreatingOwner, setIsCreatingOwner] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { owners, isLoading, createOwner, searchOwners, error } = useOwners();

  // Busca com debounce para melhor performance
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          const results = await searchOwners(searchTerm);
          setFilteredOwners(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Erro ao buscar proprietários:", error);
          setFilteredOwners([]);
          setShowSearchResults(false);
        }
      } else {
        setFilteredOwners(owners);
        setShowSearchResults(false);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, owners, searchOwners]);

  // Encontrar o proprietário selecionado
  useEffect(() => {
    if (ownerId) {
      const owner = owners.find((o) => o.id === ownerId);
      setSelectedOwner(owner || null);
    } else {
      setSelectedOwner(null);
    }
  }, [ownerId, owners]);

  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    onChange(owner.id);
    setSearchTerm("");
  };

  const handleClearOwner = () => {
    setSelectedOwner(null);
    onChange(undefined);
  };

  const handleCreateOwner = async () => {
    if (!newOwner.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    setIsCreatingOwner(true);
    try {
      const createdOwner = await createOwner({
        name: newOwner.name.trim(),
        email: newOwner.email?.trim() || undefined,
        phone: newOwner.phone?.trim() || undefined,
        notes: newOwner.notes?.trim() || undefined,
      });

      setSelectedOwner(createdOwner);
      onChange(createdOwner.id);
      setShowOwnerForm(false);
      setNewOwner({ name: "", email: "", phone: "", notes: "" });
      setSearchTerm("");
      toast.success("Proprietário criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar proprietário:", error);
      toast.error("Erro ao criar proprietário. Tente novamente.");
    } finally {
      setIsCreatingOwner(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">5</span>
          </div>
          Proprietário
        </CardTitle>
        <CardDescription>
          Selecione o proprietário da propriedade ou cadastre um novo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proprietário selecionado */}
        {selectedOwner && (
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    {selectedOwner.name}
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    {selectedOwner.email && <div>📧 {selectedOwner.email}</div>}
                    {selectedOwner.phone && <div>📱 {selectedOwner.phone}</div>}
                    {selectedOwner.document && (
                      <div>📄 {selectedOwner.document}</div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearOwner}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Formulário para criar novo proprietário */}
        {showOwnerForm && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-3">Cadastrar Novo Proprietário</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="owner-name">Nome Completo *</Label>
                <Input
                  id="owner-name"
                  value={newOwner.name}
                  onChange={(e) =>
                    setNewOwner((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nome do proprietário"
                />
              </div>
              <div>
                <Label htmlFor="owner-email">E-mail</Label>
                <Input
                  id="owner-email"
                  type="email"
                  value={newOwner.email}
                  onChange={(e) =>
                    setNewOwner((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="owner-phone">Telefone</Label>
                <Input
                  id="owner-phone"
                  value={newOwner.phone}
                  onChange={(e) =>
                    setNewOwner((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="owner-notes">Observações</Label>
                <Input
                  id="owner-notes"
                  value={newOwner.notes}
                  onChange={(e) =>
                    setNewOwner((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Informações adicionais"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                onClick={handleCreateOwner}
                disabled={!newOwner.name.trim() || isCreatingOwner}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingOwner ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {isCreatingOwner ? "Cadastrando..." : "Cadastrar Proprietário"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOwnerForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Busca e seleção de proprietário */}
        {!selectedOwner && !showOwnerForm && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar proprietário por nome, email ou documento..."
                className="pl-10"
              />
            </div>

            {/* Lista de proprietários */}
            {searchTerm && (
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {filteredOwners.length > 0 ? (
                  <div className="divide-y">
                    {filteredOwners.map((owner) => (
                      <div
                        key={owner.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleOwnerSelect(owner)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">{owner.name}</h5>
                            <div className="text-sm text-muted-foreground">
                              {owner.email && <span>{owner.email}</span>}
                              {owner.phone && (
                                <span className="ml-2">• {owner.phone}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum proprietário encontrado
                  </div>
                )}
              </div>
            )}

            {/* Botão para cadastrar novo */}
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOwnerForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Novo Proprietário
              </Button>
            </div>
          </div>
        )}

        {/* Botão para trocar proprietário */}
        {selectedOwner && !showOwnerForm && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOwnerForm(true)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Outro Proprietário
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar Proprietário
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
