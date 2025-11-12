"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { setCookie } from "cookies-next";

import { SignInForm } from "@/features/sign-in/components/sign-in-form";
import { FormSignInData, formSignInSchema } from "@/features/sign-in/schemas";
import { signInAction } from "@/features/sign-in/actions";
import { TestCredentials } from "@/features/sign-in/components/test-credentials";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const form = useForm<FormSignInData>({
    resolver: zodResolver(formSignInSchema),
    defaultValues: {
      email: "",
      password: "",
      tenantId: "",
      twoFactorToken: "",
    },
  });

  // Pré-preencher domínio se vindo do signup TRIAL
  useEffect(() => {
    const tenant = searchParams.get("tenant");
    if (tenant) {
      form.setValue("tenantId", tenant);
    }
  }, [searchParams, form]);

  const onSubmit = async (values: FormSignInData) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    try {
      // Converter valores para FormData para a server action
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("tenantId", values.tenantId);
      if (values.twoFactorToken) {
        formData.append("twoFactorToken", values.twoFactorToken);
      }

      const response = await signInAction(formData);

      if (response.success) {
        // Se requer 2FA e ainda não foi enviado o código
        if (response.requiresTwoFactor && !values.twoFactorToken) {
          setRequiresTwoFactor(true);
          setSuccessMessage("Digite o código de autenticação de dois fatores");
          setIsLoading(false);
          return;
        }

        // Se 2FA foi verificado com sucesso ou não é necessário, salvar token
        if (response.token) {
          // Store token in cookie (for Server Actions and client-side API calls)
          setCookie("access_token", response.token, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });

          setSuccessMessage("Login realizado com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      } else {
        setErrorMessage(
          response.message || "Erro ao realizar login. Tente novamente."
        );

        // Display validation errors
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errors]) => {
            form.setError(field as keyof FormSignInData, {
              type: "manual",
              message: errors?.[0] || "Erro de validação",
            });
          });
        }
      }
    } catch (error) {
      console.error("SignIn error:", error);
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
              Faça login na sua conta e acesse o painel de controle
            </p>
          </div>

          {/* Form Component */}
          <SignInForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            errorMessage={errorMessage}
            successMessage={successMessage}
            requiresTwoFactor={requiresTwoFactor}
          />

          <div className="flex flex-col gap-4">
            {/* Test Credentials Panel */}
            <TestCredentials />
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

export default SignInPage;
