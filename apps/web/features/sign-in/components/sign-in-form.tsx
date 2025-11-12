"use client";

import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { ShieldAlert } from "lucide-react";

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
import { PasswordInput } from "@/components/ui/password-input";

import { FormSignInData } from "../schemas";
import { Spinner } from "@/components/ui/spinner";

interface SignInFormProps {
  form: UseFormReturn<FormSignInData>;
  onSubmit: (values: FormSignInData) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string;
  successMessage?: string;
  requiresTwoFactor?: boolean;
}

export const SignInForm = ({
  form,
  onSubmit,
  isLoading = false,
  errorMessage,
  successMessage,
  requiresTwoFactor = false,
}: SignInFormProps) => {
  const handleSubmit = async (values: FormSignInData) => {
    await onSubmit(values);
  };

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

        {/* Tenant ID Field */}
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                ID do Tenant
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: seu-dominio"
                  className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                O ID único da sua instância ConnectHub
              </p>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
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

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Senha
                </FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* 2FA Code Field - shown when 2FA is required */}
        {requiresTwoFactor && (
          <FormField
            control={form.control}
            name="twoFactorToken"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Código de autenticação de dois fatores
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      Digite o código de 6 dígitos do seu app autenticador
                    </p>
                  </div>
                </div>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center text-2xl font-bold tracking-widest"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Entrando...
            </div>
          ) : (
            "Entrar"
          )}
        </Button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Ainda não tem uma conta?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Fazer Cadastro
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
