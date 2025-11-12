"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { FormResetPasswordData, formResetPasswordSchema } from "../schemas";
import { resetPasswordAction } from "../actions";
import { Spinner } from "@/components/ui/spinner";

export const ResetPassword = () => {
  const router = useRouter();

  // Handle search params safely on client side
  const [token, setToken] = useState<string>("");
  const [_, setMounted] = useState(false);

  // Get token from URL search params on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setToken(searchParams.get("token") || "");
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormResetPasswordData>({
    resolver: zodResolver(formResetPasswordSchema),
    defaultValues: {
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormResetPasswordData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("token", token || values.token || "");
      formData.append("newPassword", values.newPassword);
      formData.append("confirmPassword", values.confirmPassword);

      const result = await resetPasswordAction(formData);

      if (result.success) {
        setSuccessMessage(result.message || "Senha redefinida com sucesso!");
        // Redirecionar para login apos 2 segundos
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
      } else {
        setErrorMessage(result.message || "Erro ao redefinir senha");
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof FormResetPasswordData, {
              message: messages?.[0] || "Erro",
            });
          });
        }
      }
    } catch (error) {
      setErrorMessage("Erro inesperado. Tente novamente mais tarde.");
      console.error("Reset password error:", error);
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
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Nova Senha
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="nova-senha"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Confirmar Senha
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="confirmar-senha"
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
          className="w-full h-11 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Processando...
            </div>
          ) : (
            "Redefinir Senha"
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
