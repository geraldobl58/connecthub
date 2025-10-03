"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ViaCepResponse, ViaCepError } from "@/types/viacep";

export interface UseViaCepReturn {
  searchAddress: (cep: string) => Promise<ViaCepResponse | null>;
  isLoading: boolean;
  clearResults: () => void;
}

export function useViaCep(): UseViaCepReturn {
  const [isLoading, setIsLoading] = useState(false);

  const clearResults = useCallback(() => {
    // Limpa estados se necessário
  }, []);

  const searchAddress = useCallback(
    async (cep: string): Promise<ViaCepResponse | null> => {
      // Remove caracteres especiais do CEP
      const cleanCep = cep.replace(/\D/g, "");

      // Validação básica de CEP
      if (cleanCep.length !== 8) {
        return null;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );

        if (!response.ok) {
          throw new Error("Erro na consulta do CEP");
        }

        const data: ViaCepResponse | ViaCepError = await response.json();

        if ("erro" in data && data.erro) {
          toast.error(`CEP ${cleanCep} não encontrado`);
          return null;
        }

        return data as ViaCepResponse;
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error("Erro ao buscar endereço. Verifique sua conexão.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    searchAddress,
    isLoading,
    clearResults,
  };
}
