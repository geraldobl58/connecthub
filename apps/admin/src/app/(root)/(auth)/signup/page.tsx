"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Check,
  Crown,
  Star,
  Zap,
  ArrowRight,
  CreditCard,
} from "lucide-react";

const signupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  contactName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  contactEmail: z.string().email("Email inválido"),
  domain: z
    .string()
    .min(3, "Domínio deve ter pelo menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens")
    .refine(
      (val) => !val.startsWith("-") && !val.endsWith("-"),
      "Domínio não pode começar ou terminar com hífen"
    ),
  plan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]),
});

type SignupData = z.infer<typeof signupSchema>;

const plans = [
  {
    id: "STARTER",
    name: "Starter",
    icon: Star,
    price: 149,
    description: "Perfeito para pequenos negócios",
    features: [
      "Até 5 usuários",
      "1.000 leads/mês",
      "Suporte básico",
      "Dashboard essencial",
      "Relatórios básicos",
    ],
    popular: false,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    icon: Crown,
    price: 299,
    description: "Ideal para empresas em crescimento",
    features: [
      "Até 20 usuários",
      "5.000 leads/mês",
      "Suporte prioritário",
      "Relatórios avançados",
      "Integrações API",
      "Gestão de equipes",
    ],
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    icon: Zap,
    price: 599,
    description: "Para empresas de grande porte",
    features: [
      "Usuários ilimitados",
      "Leads ilimitados",
      "Suporte 24/7",
      "Customizações avançadas",
      "White label",
      "Integração personalizada",
    ],
    popular: false,
  },
];

const SignupPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("PROFESSIONAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Plano, 2: Dados, 3: Confirmação
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      plan: "PROFESSIONAL",
      companyName: "",
      contactName: "",
      contactEmail: "",
      domain: "",
    },
  });

  const watchedDomain = watch("domain");
  const watchedPlan = watch("plan");
  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const onSubmit = async (data: SignupData) => {
    setIsSubmitting(true);

    // Simular processo de assinatura
    try {
      // Aqui seria feita a chamada para a API de assinatura
      console.log("Dados da assinatura:", data);

      // Simular delay de processamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirecionar para página de sucesso (que vamos criar)
      router.push(
        `/signup/success?company=${encodeURIComponent(data.companyName)}&domain=${data.domain}`
      );
    } catch (error) {
      console.error("Erro na assinatura:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setValue("plan", planId as "STARTER" | "PROFESSIONAL" | "ENTERPRISE");
  };

  const goToNextStep = () => {
    setStep(2);
  };

  if (step === 1) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu plano ConnectHub
          </h1>
          <p className="text-xl text-gray-600">
            Comece sua jornada com a melhor plataforma CRM multi-tenant do
            mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedPlan === plan.id
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-md"
              } ${plan.popular ? "border-blue-200" : ""}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <plan.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    R${plan.price}
                  </span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button
                    className={`w-full ${
                      selectedPlan === plan.id
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selecionado" : "Selecionar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={goToNextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Continuar com {selectedPlanData?.name}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">
            ✨ O que acontece após a assinatura:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>• Criação automática do seu tenant</div>
            <div>• Configuração do subdomínio personalizado</div>
            <div>• Email com credenciais de acesso</div>
            <div>• Onboarding guiado passo a passo</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Complete sua assinatura
        </h1>
        <p className="text-gray-600">
          Você selecionou o plano <strong>{selectedPlanData?.name}</strong> por{" "}
          <strong>R$ {selectedPlanData?.price}/mês</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da sua empresa
          </CardTitle>
          <CardDescription>
            Essas informações serão usadas para configurar seu tenant
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <Input
                id="companyName"
                placeholder="Tech Solutions Corp"
                {...register("companyName")}
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactName">Nome do Responsável *</Label>
              <Input
                id="contactName"
                placeholder="João Silva"
                {...register("contactName")}
                className={errors.contactName ? "border-red-500" : ""}
              />
              {errors.contactName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contactName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactEmail">Email do Responsável *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="admin@tech-solutions.com"
                {...register("contactEmail")}
                className={errors.contactEmail ? "border-red-500" : ""}
              />
              {errors.contactEmail && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="domain">Subdomínio Personalizado *</Label>
              <div className="flex items-center">
                <Input
                  id="domain"
                  placeholder="tech-solutions"
                  {...register("domain")}
                  className={`rounded-r-none ${errors.domain ? "border-red-500" : ""}`}
                />
                <div className="bg-gray-100 border border-l-0 rounded-r-md px-3 py-2 text-sm text-gray-600">
                  .connecthub.com
                </div>
              </div>
              {errors.domain && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.domain.message}
                </p>
              )}
              {watchedDomain && !errors.domain && (
                <p className="text-green-600 text-sm mt-1">
                  ✅ Sua URL será: https://{watchedDomain}.connecthub.com
                </p>
              )}
            </div>

            {/* Resumo do Plano */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Resumo da Assinatura
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span>Plano {selectedPlanData?.name}</span>
                  <span className="font-medium">
                    R$ {selectedPlanData?.price}/mês
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Cobrança mensal</span>
                  <span>Cancele a qualquer momento</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>Total mensal</span>
                    <span>R$ {selectedPlanData?.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Finalizar Assinatura
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
