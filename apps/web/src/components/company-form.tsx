import { UseFormRegister, FieldErrors } from "react-hook-form";
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
import { Building2, CreditCard } from "lucide-react";
import { LoadingSpinner } from "./common/loading-spinner";
import { SignupValues } from "@/schemas/signup";
import { Plan } from "@/data/plans";

interface CompanyFormProps {
  register: UseFormRegister<SignupValues>;
  errors: FieldErrors<SignupValues>;
  isLoading: boolean;
  error?: string;
  watchedDomain: string;
  selectedPlan: Plan;
  onBack: () => void;
}

export const CompanyForm = ({
  register,
  errors,
  isLoading,
  error,
  watchedDomain,
  selectedPlan,
  onBack,
}: CompanyFormProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Complete sua assinatura
        </h1>
        <p className="text-gray-600">
          Você selecionou o plano <strong>{selectedPlan.name}</strong> por{" "}
          <strong>R$ {selectedPlan.price}/mês</strong>
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
          <div className="space-y-6">
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
                  ✅ Domínio reservado: {watchedDomain} | URL:
                  http://localhost:3000/dashboard
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
                  <span>Plano {selectedPlan.name}</span>
                  <span className="font-medium">
                    R$ {selectedPlan.price}/mês
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Cobrança mensal</span>
                  <span>Cancele a qualquer momento</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>Total mensal</span>
                    <span>R$ {selectedPlan.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <LoadingSpinner size={16} text="Processando..." />
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Finalizar Assinatura
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
