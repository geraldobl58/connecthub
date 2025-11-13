"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CreateClientSchema,
  type CreateClient,
} from "@/features/clients/schemas/client";
import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import {
  useCreateClient,
  useUpdateClient,
  useClient,
} from "@/features/clients";
import { Loading } from "@/components/loading";

const ClientFormPage = () => {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const isEditMode = clientId !== "new";

  // Hooks de mutação
  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  // Hook para buscar cliente (apenas em modo de edição)
  const { client, isLoading: isLoadingClient } = useClient(
    isEditMode ? clientId : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateClient>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      zipCode: "",
      phone: "",
    },
  });

  // Preencher formulário quando carregar cliente em modo de edição
  useEffect(() => {
    if (isEditMode && client) {
      reset({
        name: client.name,
        email: client.email,
        address: client.address || "",
        number: client.number || "",
        complement: client.complement || "",
        neighborhood: client.neighborhood || "",
        zipCode: client.zipCode || "",
        phone: client.phone || "",
      });
    }
  }, [client, isEditMode, reset]);

  const isLoading = isCreating || isUpdating;

  const onSubmit = (data: CreateClient) => {
    if (isEditMode) {
      updateClient(
        { id: clientId, data },
        {
          onSuccess: (response) => {
            if (response.success) {
              toast.success("Cliente atualizado com sucesso!");
              router.push("/dashboard/clients");
            } else {
              toast.error(response.message || "Erro ao atualizar cliente");
            }
          },
          onError: () => {
            toast.error("Erro ao atualizar cliente");
          },
        }
      );
    } else {
      createClient(data, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("Cliente criado com sucesso!");
            router.push("/dashboard/clients");
          } else {
            toast.error(response.message || "Erro ao criar cliente");
          }
        },
        onError: () => {
          toast.error("Erro ao criar cliente");
        },
      });
    }
  };

  // Fetch address from CEP (ViaCEP API)
  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
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
          toast.success("CEP carregado com sucesso!");
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP");
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  if (isEditMode && isLoadingClient) {
    return (
      <>
        <HeaderContainer
          title="Gerenciamento de Clientes"
          subtitle="Administre os clientes da sua plataforma"
          content={<ProfileHeader />}
        />
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <Loading
        fullscreen
        color="blue"
        title="Carregando formulário..."
        message="Aguarde enquanto buscamos suas informações."
      />
    );
  }

  return (
    <>
      <HeaderContainer
        title="Gerenciamento de Clientes"
        subtitle="Administre os clientes da sua plataforma"
        content={<ProfileHeader />}
      />
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditMode ? "Editar Cliente" : "Novo Cliente"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="grid gap-3">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Nome do cliente"
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                {...register("complement")}
              />
              {errors?.complement && (
                <p className="text-xs text-red-500">
                  {errors.complement.message}
                </p>
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
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/clients")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ClientFormPage;
