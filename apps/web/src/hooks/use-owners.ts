import { useState, useEffect } from "react";
import api from "@/lib/api";

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

  // Carregar owners da API
  useEffect(() => {
    if (enabled) {
      const loadOwners = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await api.get("/owners?limit=100");
          setOwners(response.data.data || []);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Erro ao carregar proprietários";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      loadOwners();
    }
  }, [enabled]);

  const createOwner = async (ownerData: Omit<Owner, "id">): Promise<Owner> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/owners", ownerData);
      const newOwner = response.data;
      setOwners((prev) => [...prev, newOwner]);
      return newOwner;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar proprietário";
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
      const response = await api.get(
        `/owners?search=${encodeURIComponent(query)}&limit=50`
      );
      return response.data.data || [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar proprietários";
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
      const response = await api.get(`/owners/${id}`);
      return response.data;
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return null;
      }
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar proprietário";
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
