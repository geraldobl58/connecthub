"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreateClientSchema,
  type CreateClient,
  type ClientResponse,
} from "@/features/clients/schemas/client";

interface ClientFormProps {
  isSubmitting?: boolean;
  onSubmit: (data: CreateClient) => void;
  defaultValues?: Partial<ClientResponse>;
  submitLabel?: string;
}

export function ClientForm({
  isSubmitting = false,
  onSubmit,
  defaultValues,
  submitLabel = "Salvar",
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateClient>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      address: defaultValues?.address || "",
      number: defaultValues?.number || "",
      complement: defaultValues?.complement || "",
      neighborhood: defaultValues?.neighborhood || "",
      zipCode: defaultValues?.zipCode || "",
      phone: defaultValues?.phone || "",
    },
  });

  // Fetch address from CEP (ViaCEP API)
  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace("-", "");
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          // Auto-fill fields from CEP data
          setValue("address", data.logradouro || "");
          setValue("neighborhood", data.bairro || "");
          console.log("CEP carregado com sucesso:", data);
        } else {
          console.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nome */}
      <div className="grid gap-3">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Nome do cliente"
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors?.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="grid gap-3">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          disabled={isSubmitting}
          {...register("email")}
        />
        {errors?.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Telefone */}
      <div className="grid gap-3">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(XX) XXXXX-XXXX"
          disabled={isSubmitting}
          {...register("phone")}
        />
        {errors?.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* CEP */}
      <div className="grid gap-3">
        <Label htmlFor="zipCode">CEP *</Label>
        <Input
          id="zipCode"
          placeholder="00000-000"
          disabled={isSubmitting}
          {...register("zipCode", {
            onChange: (e) => handleCepChange(e.target.value),
            onBlur: (e) => handleCepChange(e.target.value),
          })}
        />
        {errors?.zipCode && (
          <p className="text-xs text-red-500">{errors.zipCode.message}</p>
        )}
      </div>

      {/* Número e Complemento (3 colunas) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            placeholder="123"
            disabled={isSubmitting}
            {...register("number")}
          />
          {errors?.number && (
            <p className="text-xs text-red-500">{errors.number.message}</p>
          )}
        </div>

        <div className="col-span-2 grid gap-3">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto, Bloco, etc"
            disabled={isSubmitting}
            {...register("complement")}
          />
          {errors?.complement && (
            <p className="text-xs text-red-500">{errors.complement.message}</p>
          )}
        </div>
      </div>

      {/* Endereço e Bairro (2 colunas) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-3">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            placeholder="Rua, Av, etc"
            disabled
            {...register("address")}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            disabled
            {...register("neighborhood")}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
