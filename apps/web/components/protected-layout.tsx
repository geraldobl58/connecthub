/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas que requerem autenticação
 * Verifica se há token no cookie e redireciona para login se não houver
 */
export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há token no cookie
    const token = getCookie("access_token");

    if (!token) {
      // Redirecionar para login
      router.push("/auth/sign-in");
      return;
    }

    // Validar se o token não está vazio
    if (typeof token === "string" && token.trim() === "") {
      // Token vazio, redirecionar para login
      router.push("/auth/sign-in");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  // Se não autenticado, não renderizar nada (já foi redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  // Se autenticado, renderizar conteúdo
  return <>{children}</>;
}
