"use client";

import { getProfile } from "@/features/profile/http";
import { useEffect, useState } from "react";

export type ProfileData = {
  id: string;
  name: string;
  username: string;
  email: string;
  tenantId: string;
  planName: string;
  expiresAt: string;
  avatar?: string | null;
  twoFactorEnabled: boolean;
};

export type UseProfileReturn = {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Custom hook para gerenciar dados do perfil do usuário
 * Fornece acesso aos dados do perfil, estado de carregamento e tratamento de erros
 *
 * @example
 * const { profileData, isLoading, error } = useProfile();
 */
export function useProfile(): UseProfileReturn {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProfile();

      if (result.success && result.data) {
        setProfileData(result.data);
      } else {
        setError(result.message || "Falha ao buscar perfil");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Erro ao buscar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profileData,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
