"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/marketing");
      }
    }
  }, [isAuthenticated, isLoading, router]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size={32} text="Carregando..." />
    </div>
  );
}
