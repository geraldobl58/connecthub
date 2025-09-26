"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, LogIn, UserPlus, ArrowRight } from "lucide-react";

const AuthHomePage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ConnectHub</h1>
        <p className="text-xl text-gray-600">
          Plataforma CRM Multi-Tenant para empresas modernas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Card de Login */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/login")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <LogIn className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Fazer Login</CardTitle>
            <CardDescription>Entre na sua conta existente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>✅ Acesse seu tenant personalizado</p>
              <p>✅ Dashboard com suas permissões</p>
              <p>✅ Dados isolados e seguros</p>
            </div>
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/login");
              }}
            >
              Entrar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Card de Assinatura */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Assinar Agora</CardTitle>
            <CardDescription>Comece sua jornada no ConnectHub</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>🚀 Teste gratuito de 14 dias</p>
              <p>🏢 Seu próprio tenant isolado</p>
              <p>⚡ Configuração em minutos</p>
            </div>
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/signup");
              }}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Demonstração das empresas existentes */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-center text-purple-800">
            🧪 Demonstração ao Vivo
          </CardTitle>
          <CardDescription className="text-center text-purple-600">
            Veja o sistema em ação com empresas fictícias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-800">Empresa Demo</h3>
              <p className="text-sm text-purple-600 mb-3">empresa-demo</p>
              <p className="text-xs text-purple-500">
                4 usuários • Todas as roles
              </p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-800">Imobiliária ABC</h3>
              <p className="text-sm text-purple-600 mb-3">imobiliaria-abc</p>
              <p className="text-xs text-purple-500">
                3 usuários • Estrutura enxuta
              </p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-800">Tech Solutions</h3>
              <p className="text-sm text-purple-600 mb-3">tech-solutions</p>
              <p className="text-xs text-purple-500">
                5 usuários • Equipe completa
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Testar com Credenciais Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Por que escolher o ConnectHub?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Multi-Tenant</h3>
            <p className="text-sm text-gray-600">
              Isolamento completo de dados entre empresas
            </p>
          </div>

          <div className="p-6">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Role-Based</h3>
            <p className="text-sm text-gray-600">
              Controle granular de permissões por usuário
            </p>
          </div>

          <div className="p-6">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Seguro</h3>
            <p className="text-sm text-gray-600">
              Autenticação JWT e middleware de proteção
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHomePage;
