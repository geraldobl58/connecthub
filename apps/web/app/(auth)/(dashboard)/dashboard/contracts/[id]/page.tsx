"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  CreateContract,
  CreateContractSchema,
  useContract,
  useCreateContract,
  useUpdateContract,
} from "@/features/contracts";
import { useAllClients } from "@/features/clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";
import { ArrowLeft, ChevronDownIcon, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContractFormPage = () => {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;
  const isEditMode = contractId !== "new";

  const { mutate: createContract, isPending: isCreating } = useCreateContract();
  const { mutate: updateContract, isPending: isUpdating } = useUpdateContract();
  const { clients: allClients, isLoading: isLoadingClients } = useAllClients();

  // Remove duplicados baseado no NOME (mantém apenas a primeira ocorrência de cada nome)
  const clients = useMemo(() => {
    if (!allClients || !Array.isArray(allClients)) return [];

    // Criar um Map para garantir unicidade por NOME (não ID)
    const clientsMap = new Map();
    allClients.forEach((client) => {
      if (client && client.id && client.name) {
        // Só adiciona se o nome ainda não existe no Map
        if (!clientsMap.has(client.name)) {
          clientsMap.set(client.name, client);
        }
      }
    });

    const uniqueClients = Array.from(clientsMap.values());
    console.log(
      "Total clientes:",
      allClients.length,
      "Únicos por nome:",
      uniqueClients.length,
      "Clientes:",
      uniqueClients.map((c) => ({ id: c.id, name: c.name }))
    );
    return uniqueClients;
  }, [allClients]);

  const [openInitialDate, setOpenInitialDate] = useState(false);
  const [openFinalDate, setOpenFinalDate] = useState(false);
  const [openSignedDate, setOpenSignedDate] = useState(false);

  const { contract, isLoading: isLoadingContract } = useContract(
    isEditMode ? contractId : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateContract>({
    resolver: zodResolver(CreateContractSchema),
    defaultValues: {
      title: "",
      identifier: "",
      content: "",
      initialEffectiveDate: "",
      finalEffectiveDate: "",
      clientId: "",
      signedAt: "",
    },
  });

  // Watch form values for dates
  const initialEffectiveDateValue = watch("initialEffectiveDate");
  const finalEffectiveDateValue = watch("finalEffectiveDate");
  const signedAtValue = watch("signedAt");

  // Derive date objects from form values
  const initialDate = initialEffectiveDateValue
    ? new Date(initialEffectiveDateValue)
    : undefined;
  const finalDate = finalEffectiveDateValue
    ? new Date(finalEffectiveDateValue)
    : undefined;
  const signedDate = signedAtValue ? new Date(signedAtValue) : undefined;

  useEffect(() => {
    if (isEditMode && contract) {
      reset({
        title: contract.title,
        identifier: contract.identifier,
        content: contract.content || "",
        initialEffectiveDate: contract.initialEffectiveDate,
        finalEffectiveDate: contract.finalEffectiveDate,
        clientId: contract.clientId || "",
        signedAt: contract.signedAt || "",
      });
    }
  }, [isEditMode, contract, reset]);

  const isLoading = isCreating || isUpdating;

  const onSubmit = (data: CreateContract) => {
    if (isEditMode) {
      updateContract(
        { id: contractId, data },
        {
          onSuccess: (response) => {
            if (response.success) {
              toast.success("Contrato atualizado com sucesso!");
              router.push("/dashboard/contracts");
            } else {
              toast.error(
                response.message ||
                  "Erro ao atualizar contrato. Tente novamente."
              );
            }
          },
          onError: () => {
            toast.error("Erro ao atualizar contrato. Tente novamente.");
          },
        }
      );
    } else {
      createContract(data, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("Contrato criado com sucesso!");
            router.push("/dashboard/contracts");
          } else {
            toast.error(response.message || "Erro ao criar contrato");
          }
        },
        onError: () => {
          toast.error("Erro ao criar cliente");
        },
      });
    }
  };

  if (isEditMode && isLoadingContract) {
    return (
      <>
        <HeaderContainer
          title="Gerenciamento de Contratos"
          subtitle="Administre os contratos da sua plataforma"
          content={<ProfileHeader />}
        />
        <div className="flex items-center justify-center p-8">
          <Spinner />
        </div>
      </>
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
            onClick={() => router.push("/dashboard/contracts")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {isEditMode ? "Editar Contrato" : "Novo Contrato"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="grid gap-3">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Nome do cliente"
              disabled={isLoading}
              {...register("title")}
            />
            {errors?.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="identifier">Identificador *</Label>
            <Input
              id="identifier"
              placeholder="Identificador do contrato"
              disabled={isLoading}
              {...register("identifier")}
            />
            {errors?.identifier && (
              <p className="text-xs text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="content">Descrição</Label>
            <Textarea
              id="content"
              placeholder="Descrição do contrato"
              disabled={isLoading}
              {...register("content")}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="initialEffectiveDate" className="px-1">
                Data Inicial *
              </Label>
              <Popover open={openInitialDate} onOpenChange={setOpenInitialDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="initialEffectiveDate"
                    className="w-full justify-between font-normal"
                    disabled={isLoading}
                  >
                    {initialDate
                      ? initialDate.toLocaleDateString("pt-BR")
                      : "Selecione a data inicial"}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={initialDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        setValue("initialEffectiveDate", date.toISOString());
                      }
                      setOpenInitialDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors?.initialEffectiveDate && (
                <p className="text-xs text-red-500">
                  {errors.initialEffectiveDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="finalEffectiveDate" className="px-1">
                Data Final *
              </Label>
              <Popover open={openFinalDate} onOpenChange={setOpenFinalDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="finalEffectiveDate"
                    className="w-full justify-between font-normal"
                    disabled={isLoading}
                  >
                    {finalDate
                      ? finalDate.toLocaleDateString("pt-BR")
                      : "Selecione a data final"}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={finalDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        setValue("finalEffectiveDate", date.toISOString());
                      }
                      setOpenFinalDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors?.finalEffectiveDate && (
                <p className="text-xs text-red-500">
                  {errors.finalEffectiveDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="signedAt" className="px-1">
                Data Assinatura
              </Label>
              <Popover open={openSignedDate} onOpenChange={setOpenSignedDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="signedAt"
                    className="w-full justify-between font-normal"
                    disabled={isLoading}
                  >
                    {signedDate
                      ? signedDate.toLocaleDateString("pt-BR")
                      : "Selecione a data de assinatura"}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={signedDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        setValue("signedAt", date.toISOString());
                      } else {
                        setValue("signedAt", "");
                      }
                      setOpenSignedDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors?.signedAt && (
                <p className="text-xs text-red-500">
                  {errors.signedAt.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="clientId">Cliente *</Label>
              {clients && clients.length > 0 ? (
                <Select
                  value={watch("clientId") || ""}
                  onValueChange={(value) => setValue("clientId", value)}
                  disabled={isLoading || isLoadingClients}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client: { id: string; name: string }) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  {isLoadingClients ? "Carregando..." : "Nenhum cliente cadastrado"}
                </div>
              )}
              {errors?.clientId && (
                <p className="text-xs text-red-500">
                  {errors.clientId.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/contracts")}
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

export default ContractFormPage;
