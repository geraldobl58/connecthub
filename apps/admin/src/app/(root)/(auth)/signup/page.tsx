"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { signupSchema, SignupValues } from "@/schemas/signup";
import { useSignup } from "@/hooks/auth";
import { plans } from "@/data/plans";
import { PlanCard } from "@/components/signup/PlanCard";
import { CompanyForm } from "@/components/signup/CompanyForm";

const SignupPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("PROFESSIONAL");
  const [step, setStep] = useState(1); // 1: Plano, 2: Dados
  const { signup, isLoading, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupValues>({
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
  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const onSubmit = (data: SignupValues) => {
    signup(data);
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
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={handlePlanSelect}
            />
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <CompanyForm
        register={register}
        errors={errors}
        isLoading={isLoading}
        error={error}
        watchedDomain={watchedDomain}
        selectedPlan={selectedPlanData!}
        onBack={() => setStep(1)}
      />
    </form>
  );
};

export default SignupPage;
