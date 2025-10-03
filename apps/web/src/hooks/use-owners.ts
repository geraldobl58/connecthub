import { useState, useEffect } from "react";

export interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
}

interface UseOwnersProps {
  enabled?: boolean;
}

interface UseOwnersReturn {
  owners: Owner[];
  isLoading: boolean;
  error: string | null;
  createOwner: (ownerData: Omit<Owner, "id">) => Promise<Owner>;
  searchOwners: (query: string) => Promise<Owner[]>;
  getOwnerById: (id: string) => Promise<Owner | null>;
}

export function useOwners({
  enabled = true,
}: UseOwnersProps = {}): UseOwnersReturn {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data inicial - em produção, isso viria de uma API
  useEffect(() => {
    if (enabled) {
      const mockOwners: Owner[] = [
        {
          id: "owner-1",
          name: "João Silva",
          email: "joao.silva@email.com",
          phone: "(11) 99999-9999",
          document: "123.456.789-00",
        },
        {
          id: "owner-2",
          name: "Maria Santos",
          email: "maria.santos@email.com",
          phone: "(11) 88888-8888",
          document: "987.654.321-00",
        },
        {
          id: "owner-3",
          name: "Carlos Oliveira",
          email: "carlos.oliveira@email.com",
          phone: "(11) 77777-7777",
          document: "456.789.123-00",
        },
        {
          id: "owner-4",
          name: "Ana Costa",
          email: "ana.costa@email.com",
          phone: "(11) 66666-6666",
          document: "789.123.456-00",
        },
      ];
      setOwners(mockOwners);
    }
  }, [enabled]);

  const createOwner = async (ownerData: Omit<Owner, "id">): Promise<Owner> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular chamada para API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newOwner: Owner = {
        id: `owner-${Date.now()}`,
        ...ownerData,
      };

      // Em produção, aqui você faria a chamada para a API
      // const response = await fetch('/api/owners', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(ownerData)
      // });
      // const newOwner = await response.json();

      setOwners((prev) => [...prev, newOwner]);
      return newOwner;
    } catch (err) {
      const errorMessage = "Erro ao criar proprietário";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const searchOwners = async (query: string): Promise<Owner[]> => {
    if (!query.trim()) return owners;

    setIsLoading(true);
    setError(null);

    try {
      // Simular busca - em produção, isso viria de uma API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filteredOwners = owners.filter(
        (owner) =>
          owner.name.toLowerCase().includes(query.toLowerCase()) ||
          owner.email?.toLowerCase().includes(query.toLowerCase()) ||
          owner.document?.includes(query)
      );

      return filteredOwners;
    } catch (err) {
      const errorMessage = "Erro ao buscar proprietários";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getOwnerById = async (id: string): Promise<Owner | null> => {
    if (!id) return null;

    setIsLoading(true);
    setError(null);

    try {
      // Simular busca - em produção, isso viria de uma API
      await new Promise((resolve) => setTimeout(resolve, 200));

      const owner = owners.find((o) => o.id === id);
      return owner || null;
    } catch (err) {
      const errorMessage = "Erro ao buscar proprietário";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    owners,
    isLoading,
    error,
    createOwner,
    searchOwners,
    getOwnerById,
  };
}
