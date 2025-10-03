import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

interface UsePropertyCodeValidationProps {
  code: string;
  excludeId?: string; // ID da propriedade a ser excluída da verificação (para edição)
  enabled?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  isLoading: boolean;
  error?: string;
}

export function usePropertyCodeValidation({
  code,
  excludeId,
  enabled = true,
}: UsePropertyCodeValidationProps): ValidationResult {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const debouncedCode = useDebounce(code, 500);

  useEffect(() => {
    if (!enabled || !debouncedCode || debouncedCode.length < 2) {
      setIsValid(true);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    const validateCode = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        // Em produção, aqui você faria uma chamada para a API
        // const response = await fetch(`/api/properties/validate-code?code=${encodeURIComponent(debouncedCode)}${excludeId ? `&excludeId=${excludeId}` : ''}`);

        // Simulação de validação - em produção, remover este bloco
        const mockExistingCodes = ["485552", "PROP001", "CASA123"];
        const codeExists = mockExistingCodes.includes(
          debouncedCode.toUpperCase()
        );

        if (codeExists) {
          setIsValid(false);
          setError("Este código já está sendo usado por outra propriedade");
        } else {
          setIsValid(true);
          setError(undefined);
        }

        // Código real para produção:
        // if (response.ok) {
        //   const result = await response.json();
        //   setIsValid(result.isValid);
        //   setError(result.error);
        // } else {
        //   setIsValid(false);
        //   setError("Erro ao validar código");
        // }
      } catch (err) {
        setIsValid(false);
        setError("Erro ao validar código");
      } finally {
        setIsLoading(false);
      }
    };

    validateCode();
  }, [debouncedCode, excludeId, enabled]);

  return { isValid, isLoading, error };
}
