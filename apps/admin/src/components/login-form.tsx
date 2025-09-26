"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { Eye, EyeOff, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "@/hooks/auth";

import { loginSchema, LoginValues } from "@/schemas/auth";

interface LoginFormProps {
  showTenantField?: boolean;
  onSuccess?: () => void;
}

export const LoginForm = ({
  showTenantField = false,
  onSuccess,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error: loginError } = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      tenantId: "",
    },
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tenantParam = searchParams.get("tenant");

    if (emailParam) {
      setValue("email", emailParam);
    }
    if (tenantParam) {
      setValue("tenantId", tenantParam);
    }
  }, [searchParams, setValue]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginValues) => {
    const cleanedData: LoginValues = {
      email: data.email,
      password: data.password,
    };

    if (
      data.tenantId &&
      data.tenantId.trim() &&
      data.tenantId.trim() !== "$undefined"
    ) {
      cleanedData.tenantId = data.tenantId.trim();
    }

    try {
      await login(cleanedData);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      }, 500);
    } catch (error) {}
  };

  // Valores para demo - Organizados por tenant e role
  const demoCredentials = [
    // Empresa Demo - Usuários completos
    {
      email: "admin@empresa-demo.com",
      tenant: "empresa-demo",
      role: "Admin",
      level: "🔴 Nível 4",
    },
    {
      email: "manager@empresa-demo.com",
      tenant: "empresa-demo",
      role: "Manager",
      level: "🔵 Nível 3",
    },
    {
      email: "agent@empresa-demo.com",
      tenant: "empresa-demo",
      role: "Agent",
      level: "🟢 Nível 2",
    },
    {
      email: "viewer@empresa-demo.com",
      tenant: "empresa-demo",
      role: "Viewer",
      level: "🔘 Nível 1",
    },

    // Imobiliária ABC - Estrutura enxuta
    {
      email: "admin@imobiliaria-abc.com",
      tenant: "imobiliaria-abc",
      role: "Admin",
      level: "🔴 Nível 4",
    },
    {
      email: "maria@imobiliaria-abc.com",
      tenant: "imobiliaria-abc",
      role: "Agent",
      level: "🟢 Nível 2",
    },

    // Tech Solutions Corp - Equipe de desenvolvimento
    {
      email: "admin@tech-solutions.com",
      tenant: "tech-solutions",
      role: "CTO",
      level: "🔴 Nível 4",
    },
    {
      email: "manager@tech-solutions.com",
      tenant: "tech-solutions",
      role: "PM",
      level: "🔵 Nível 3",
    },
    {
      email: "dev.senior@tech-solutions.com",
      tenant: "tech-solutions",
      role: "Dev Sr",
      level: "🟢 Nível 2",
    },
    {
      email: "estagiario@tech-solutions.com",
      tenant: "tech-solutions",
      role: "Estagiário",
      level: "🔘 Nível 1",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {showTenantField && (
          <div>
            <Label
              htmlFor="tenantId"
              className="block text-xs font-medium mb-1"
            >
              <Building2 className="inline w-3 h-3 mr-1" />
              Tenant (opcional)
            </Label>
            <Input
              id="tenantId"
              type="text"
              placeholder="empresa-demo"
              {...register("tenantId")}
              disabled={isLoading}
              className={errors.tenantId ? "border-red-500" : ""}
            />
            {errors.tenantId && (
              <p className="text-red-700 text-xs mt-1">
                {errors.tenantId.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Deixe vazio para busca automática
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="email" className="block text-xs font-medium mb-1">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            disabled={isLoading}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-700 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="block text-xs font-medium mb-1">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              {...register("password")}
              disabled={isLoading}
              className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
            />
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-700 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {loginError && (
          <div className="p-3 text-xs text-red-700 bg-red-100 border border-red-300 rounded-md">
            <strong>Erro:</strong> {loginError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              <span>Entrando...</span>
            </div>
          ) : (
            "Entrar"
          )}
        </Button>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold mb-3 text-blue-800 flex items-center gap-2">
            🧪 Credenciais de Demonstração
          </h4>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {/* Agrupar por tenant */}
            {["empresa-demo", "imobiliaria-abc", "tech-solutions"].map(
              (tenant) => {
                const tenantCreds = demoCredentials.filter(
                  (cred) => cred.tenant === tenant
                );
                const tenantNames = {
                  "empresa-demo": "🏢 Empresa Demo",
                  "imobiliaria-abc": "🏠 Imobiliária ABC",
                  "tech-solutions": "💻 Tech Solutions",
                };

                return (
                  <div key={tenant} className="mb-4">
                    <h5 className="text-xs font-medium text-gray-600 mb-2">
                      {tenantNames[tenant as keyof typeof tenantNames]}
                    </h5>
                    <div className="space-y-2 pl-2">
                      {tenantCreds.map((cred, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-mono bg-white p-2 rounded border border-gray-200 shadow-sm">
                            {cred.email}
                          </div>
                          <div className="text-gray-500 mt-1 flex items-center justify-between">
                            <span>{cred.role}</span>
                            <span className="text-xs">{cred.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <div className="text-xs text-blue-700 flex items-center gap-2">
              <strong>🔑 Senha para todos:</strong>{" "}
              <code className="bg-blue-100 px-2 py-1 rounded font-mono">
                Demo123!
              </code>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              💡 Teste diferentes roles para ver permissões distintas no
              dashboard
            </div>
          </div>
        </div>

        {/* Link para assinatura */}
        <div className="text-center pt-4 border-t mt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Assine o ConnectHub
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
