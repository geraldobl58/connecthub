"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  ExternalLink,
  ArrowRight,
  Building2,
} from "lucide-react";

const SignupSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const company = searchParams.get("company");
    const domainParam = searchParams.get("domain");
    const messageParam = searchParams.get("message");

    if (company) setCompanyName(decodeURIComponent(company));
    if (domainParam) setDomain(domainParam);
    if (messageParam) setMessage(decodeURIComponent(messageParam));
  }, [searchParams]);

  const handleGoToPlatform = () => {
    if (domain) {
      router.push(`/tenant-info?tenant=${domain}`);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Parabéns, {companyName}!
        </h1>
        <p className="text-xl text-gray-600">
          Seu cadastro foi realizado com sucesso
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Sua plataforma está sendo preparada
          </CardTitle>
          <CardDescription>
            {message || "Cadastro realizado com sucesso!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">
              📧 Próximos passos
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Email com suas credenciais de acesso (email e senha
                  temporária) foi enviado
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Nossa equipe está configurando seu tenant personalizado
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Em breve você receberá um email de onboarding</span>
              </div>
            </div>
          </div>

          {domain && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                🌐 Sua URL personalizada
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-mono bg-white px-2 py-1 rounded border">
                  http://localhost:3000/dashboard (após login)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGoToPlatform}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ver Detalhes
                </Button>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-900 mb-2">
              ⏱️ Tempo de configuração
            </h3>
            <p className="text-sm text-amber-700">
              A configuração completa do seu tenant pode levar até 15 minutos.
              Durante este período, você receberá todos os detalhes por email.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="w-full"
          >
            Voltar ao Início
          </Button>
          {domain && (
            <Button
              onClick={handleGoToPlatform}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Ver Informações do Tenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Precisa de ajuda?{" "}
            <a
              href="mailto:suporte@connecthub.com"
              className="text-blue-600 hover:text-blue-800"
            >
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessPage;
