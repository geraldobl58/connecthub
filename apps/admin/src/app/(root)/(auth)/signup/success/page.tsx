"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building2, Mail, Globe, ArrowRight, Copy, Check } from "lucide-react";

export default function SignupSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const companyName = searchParams.get("company") || "Sua empresa";
  const domain = searchParams.get("domain") || "empresa";
  const tenantUrl = `https://${domain}.connecthub.com`;

  // Simular credenciais temporárias (em produção viriam da API)
  const tempCredentials = {
    email: `admin@${domain}.com`,
    password: "TempPass123!",
  };

  const copyCredentials = async () => {
    const credentialsText = `Email: ${tempCredentials.email}\nSenha: ${tempCredentials.password}`;
    await navigator.clipboard.writeText(credentialsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToLogin = () => {
    // Em produção, redirecionaria para o subdomínio do tenant
    // Por enquanto, vamos para o login com os dados preenchidos
    router.push(`/login?email=${encodeURIComponent(tempCredentials.email)}&tenant=${domain}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Assinatura realizada com sucesso!
        </h1>
        <p className="text-xl text-gray-600">
          Bem-vindo ao ConnectHub, <strong>{companyName}</strong>!
        </p>
      </div>

      <div className="space-y-6">
        {/* Status da conta */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Sua conta está pronta!
            </CardTitle>
            <CardDescription className="text-green-700">
              Seu tenant foi criado com sucesso e está ativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Status do tenant:</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  ✅ Ativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">URL personalizada:</span>
                <a
                  href={tenantUrl}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {tenantUrl}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Tenant ID:</span>
                <code className="bg-green-100 px-2 py-1 rounded text-xs">{domain}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credenciais de acesso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Suas credenciais de acesso
            </CardTitle>
            <CardDescription>
              Use essas credenciais para fazer seu primeiro login (senha temporária)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email do administrador:</label>
                <div className="mt-1 p-2 bg-gray-50 border rounded font-mono text-sm">
                  {tempCredentials.email}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Senha temporária:</label>
                <div className="mt-1 p-2 bg-gray-50 border rounded font-mono text-sm">
                  {tempCredentials.password}
                </div>
              </div>

              <Button
                onClick={copyCredentials}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Credenciais copiadas!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar credenciais
                  </>
                )}
              </Button>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  <strong>⚠️ Importante:</strong> Você será solicitado a alterar sua senha no primeiro login
                  para garantir a segurança da sua conta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Próximos passos</CardTitle>
            <CardDescription>
              Configure sua conta e comece a usar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Faça seu primeiro login</p>
                  <p className="text-sm text-gray-600">
                    Use as credenciais acima para acessar o sistema
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Altere sua senha</p>
                  <p className="text-sm text-gray-600">
                    Defina uma senha segura para sua conta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Configure dados da empresa</p>
                  <p className="text-sm text-gray-600">
                    Complete as informações do seu negócio
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">Convide sua equipe</p>
                  <p className="text-sm text-gray-600">
                    Adicione usuários e defina suas permissões
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  5
                </div>
                <div>
                  <p className="font-medium">Comece a usar!</p>
                  <p className="text-sm text-gray-600">
                    Explore todas as funcionalidades do ConnectHub
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA para login */}
        <div className="text-center">
          <Button
            onClick={goToLogin}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Fazer login agora
          </Button>
        </div>

        {/* Informações de suporte */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Precisa de ajuda?</strong>
              </p>
              <p className="text-sm text-blue-600">
                Nossa equipe de onboarding está pronta para ajudar você a começar.
              </p>
              <p className="text-sm text-blue-600 mt-1">
                📧 suporte@connecthub.com | 📞 (11) 99999-9999
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}