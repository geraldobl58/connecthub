"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle,
  Mail,
  ArrowRight,
  User,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TenantInfoPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tenant, setTenant] = useState("");

  useEffect(() => {
    const tenantParam = searchParams.get("tenant");
    if (tenantParam) {
      setTenant(tenantParam);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-100 p-4">
            <Building2 className="h-16 w-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Tenant Configurado!
        </h1>
        <p className="text-xl text-gray-600">
          Informações do tenant: <strong>{tenant || "Não especificado"}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status do Tenant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Status do Tenant
            </CardTitle>
            <CardDescription>
              Informações sobre a configuração atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Identificador
                </p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {tenant || "tenant-example"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ativo e Configurado
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ambiente</p>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  Desenvolvimento Local
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email de Teste */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Email de Boas-vindas
            </CardTitle>
            <CardDescription>
              Verifique se recebeu o email no Mailtrap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">
                  🔐 Credenciais de acesso enviadas
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Verifique sua caixa de entrada no Mailtrap para ver o email
                  com suas credenciais (email + senha temporária)
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  Configuração Email
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Host:</strong> sandbox.smtp.mailtrap.io
                  </p>
                  <p>
                    <strong>Port:</strong> 2525
                  </p>
                  <p>
                    <strong>Username:</strong> 619b341dfa93e8
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Passos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>📋 Próximos Passos de Teste</CardTitle>
          <CardDescription>
            Validações para confirmar que tudo está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">1. Tenant Criado</p>
                <p className="text-sm text-green-700">
                  O tenant {tenant} foi criado com sucesso no banco de dados
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">2. Email Enviado</p>
                <p className="text-sm text-blue-700">
                  Verifique o Mailtrap para confirmar o recebimento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <User className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">3. Usuário Admin</p>
                <p className="text-sm text-purple-700">
                  Conta de administrador criada com senha temporária
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Lock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">4. Fazer Login</p>
                <p className="text-sm text-orange-700">
                  Use as credenciais recebidas por email para acessar
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          Voltar ao Início
        </Button>

        <Button
          onClick={() => router.push(`/login?tenant=${tenant}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          Fazer Login
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-2">
          🔧 Informações de Debug
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Tenant ID:</strong> {tenant || "Não especificado"}
          </p>
          <p>
            <strong>URL Atual:</strong>{" "}
            {typeof window !== "undefined" ? window.location.href : "N/A"}
          </p>
          <p>
            <strong>Email Status:</strong> Configurado para Mailtrap (sandbox)
          </p>
          <p>
            <strong>Ambiente:</strong> Desenvolvimento Local
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantInfoPage;
