"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const hasTenantParam = searchParams.get("tenant") !== null;

  return (
    <div className="container max-w-md mx-auto my-8 border p-8 rounded-sm shadow">
      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
        <Logo />
        <Separator />

        {hasTenantParam && (
          <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              🎉 <strong>Bem-vindo!</strong> Use suas credenciais para acessar sua conta.
            </p>
          </div>
        )}

        <div className="w-full mt-8">
          <LoginForm showTenantField={true} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
