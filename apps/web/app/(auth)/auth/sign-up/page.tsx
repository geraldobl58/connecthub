"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { FormSignUpData, formSignUpSchema } from "@/features/sign-up/schemas";
import { SignUpForm } from "@/features/sign-up/components/sign-in-form";
import { signUpAction } from "@/features/sign-up/actions";

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const form = useForm<FormSignUpData>({
    resolver: zodResolver(formSignUpSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      contactEmail: "",
      domain: "",
      plan: "TRIAL",
    },
  });

  const onSubmit = async (values: FormSignUpData) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    try {
      // Converter valores para FormData para a server action
      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("contactName", values.contactName);
      formData.append("contactEmail", values.contactEmail);
      formData.append("domain", values.domain);
      formData.append("plan", values.plan);

      const response = await signUpAction(formData);

      if (response.success) {
        setSuccessMessage(response.message);
        form.reset();

        // Se for TRIAL, redirecionar para login
        if (response.isTrial && response.tenantSlug) {
          // Redirecionar para login com slug do tenant como query param
          router.push(`/auth/sign-in?tenant=${response.tenantSlug}`);
        } else if (response.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = response.checkoutUrl;
        }
      } else {
        setErrorMessage(
          response.message || "Erro ao realizar cadastro. Tente novamente."
        );

        // Display validation errors
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errors]) => {
            form.setError(field as keyof FormSignUpData, {
              type: "manual",
              message: errors?.[0] || "Erro de validação",
            });
          });
        }
      }
    } catch (error) {
      console.error("SignUp error:", error);
      setErrorMessage("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main content container */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Card wrapper */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 space-y-8 border border-white/20">
          {/* Logo and Header */}
          <div className="space-y-3 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Image
                  src="/assets/images/logo.svg"
                  width={48}
                  height={48}
                  alt="ConnectHub"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ConnectHub
            </h1>
            <p className="text-gray-600 text-sm">
              Comece sua jornada com uma solução completa de comunicação
            </p>
          </div>

          {/* Form Component */}
          <SignUpForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />

          {/* Footer Info */}
          <div className="text-center text-xs text-gray-500 space-y-2">
            <p>
              Ao cadastrar, você concorda com nossos{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Termos de Serviço
              </a>
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-xs flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            100% Seguro e Criptografado
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
