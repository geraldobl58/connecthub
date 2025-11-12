"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormSignUpData } from "../schemas";
import { Spinner } from "@/components/ui/spinner";

interface SignUpFormProps {
  form: UseFormReturn<FormSignUpData>;
  onSubmit: (values: FormSignUpData) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

const PLANS = [
  {
    value: "TRIAL",
    label: "Trial",
    description: "Comece gratuitamente",
    price: 0,
    trialDurationHours: 2,
    isTrial: true,
    features: [
      "Até 4 usuários",
      "3 propriedades",
      "10 contatos",
      "2 horas de teste",
    ],
  },
  {
    value: "STARTER",
    label: "Starter",
    description: "Perfeito para começar",
    price: 150,
    isTrial: false,
    features: ["Até 4 usuários", "3 propriedades", "10 contatos"],
  },
  {
    value: "PROFESSIONAL",
    label: "Professional",
    description: "Para empresas em crescimento",
    price: 300,
    isTrial: false,
    features: ["Até 4 usuários", "10 propriedades", "20 contatos", "API"],
  },
  {
    value: "ENTERPRISE",
    label: "Enterprise",
    description: "Solução completa",
    price: 600,
    isTrial: false,
    features: ["Até 4 usuários", "50 propriedades", "30 contatos", "API"],
  },
];

export const SignUpForm = ({
  form,
  onSubmit,
  isLoading = false,
  errorMessage,
  successMessage,
}: SignUpFormProps) => {
  const handleSubmit = async (values: FormSignUpData) => {
    await onSubmit(values);
  };

  // Auto-preencher domain baseado em companyName
  const companyName = form.watch("companyName");

  useEffect(() => {
    if (companyName?.trim()) {
      // Converter para lowercase, remover espaços e caracteres especiais
      const domain = companyName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // espaços para hífen
        .replace(/[^a-z0-9-]/g, "") // remover caracteres especiais
        .replace(/^-+|-+$/g, ""); // remover hífens nas extremidades

      form.setValue("domain", domain, { shouldValidate: false });
    }
  }, [companyName, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        {/* Status Messages */}
        {errorMessage && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-900">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-900">
              {successMessage}
            </p>
          </div>
        )}

        {/* Company Name Field */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Nome da Empresa
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome da sua empresa"
                  className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Domain Field */}
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Domínio
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="gerado automaticamente"
                    className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled
                    {...field}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-gray-500">
                Este domínio será usado para acessar sua instância
              </p>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Contact Name Field */}
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Nome Completo
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu nome completo"
                  className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Contact Email Field */}
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                E-mail
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Plan Selection Field */}
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Selecione seu Plano
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.value}
                      type="button"
                      onClick={() => field.onChange(plan.value)}
                      className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                        field.value === plan.value
                          ? plan.isTrial
                            ? "border-green-500 bg-green-50"
                            : "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={isLoading}
                    >
                      {plan.isTrial && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-semibold">
                          GRÁTIS
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-semibold text-sm text-gray-900">
                          {plan.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {plan.description}
                        </div>
                        <div
                          className={`text-sm font-bold mt-2 ${
                            plan.isTrial ? "text-green-600" : "text-gray-900"
                          }`}
                        >
                          {plan.price === 0 ? (
                            <span>Grátis</span>
                          ) : (
                            <>
                              {plan.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}{" "}
                              <span className="text-xs font-normal text-gray-600">
                                /mês
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </FormControl>
              <p className="text-xs text-gray-500">
                Selecione o plano que melhor se adequa ao seu negócio.{" "}
                {PLANS.find((p) => p.value === field.value)?.isTrial
                  ? "Comece com 2 horas grátis - sem cartão de crédito necessário!"
                  : PLANS.find((p) => p.value === field.value)?.description}
              </p>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Cadastrando...
            </div>
          ) : (
            "Criar Conta"
          )}
        </Button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
