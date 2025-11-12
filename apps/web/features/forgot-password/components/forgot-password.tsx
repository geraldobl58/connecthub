"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormForgotPasswordData,
  formForgotPasswordSchema,
} from "@/features/forgot-password/schemas";
import { forgotPasswordAction } from "@/features/forgot-password/actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormForgotPasswordData>({
    resolver: zodResolver(formForgotPasswordSchema),
    defaultValues: {
      tenantId: "",
      email: "",
    },
  });

  const onSubmit = async (values: FormForgotPasswordData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("tenantId", values.tenantId);

      const result = await forgotPasswordAction(formData);

      if (result.success) {
        setSuccessMessage(result.message || "Email enviado com sucesso!");
        form.reset();
      } else {
        setErrorMessage(
          result.message || "Erro ao enviar email de recuperação"
        );
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof FormForgotPasswordData, {
              message: messages?.[0] || "Erro",
            });
          });
        }
      }
    } catch (error) {
      setErrorMessage("Erro inesperado. Tente novamente mais tarde.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Success Message */}
        {successMessage && (
          <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-800">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Tenant ID
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="seu-tenant-id"
                  className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full h-11 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Processando...
            </div>
          ) : (
            "Recuperar Senha"
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Voltar ao Login
          </Link>
        </p>
      </div>
    </Form>
  );
};
