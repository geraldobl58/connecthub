"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  StepContent,
  StepIcon,
} from "@/components/ui/stepper";
import { Form } from "@/components/ui/form";
import {
  createPropertySchema,
  updatePropertySchema,
  CreatePropertyValues,
  UpdatePropertyValues,
  PropertyType,
  PropertyStatus,
} from "@/schemas/property";
import { Property, PropertyMedia } from "@/types/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  BasicInfoStep,
  CharacteristicsStep,
  AddressStep,
  MediaStep,
} from "@/components/property-steps";

interface PropertyFormStepperProps {
  mode?: "create" | "edit";
  property?: Property;
  onSuccess?: () => void;
}

const steps = [
  {
    label: "Informações Básicas",
    description: "Código, título, tipo e descrição",
  },
  {
    label: "Características",
    description: "Quartos, banheiros, vagas e área",
  },
  {
    label: "Endereço",
    description: "Localização da propriedade",
  },
  {
    label: "Imagens",
    description: "Fotos da propriedade",
  },
];

export function PropertyFormStepper({
  mode = "create",
  property,
  onSuccess,
}: PropertyFormStepperProps) {
  const { user: currentUser } = useAuth();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const isEditMode = mode === "edit" && property;
  const isAdmin = currentUser?.role === "ADMIN";
  const isManager = currentUser?.role === "MANAGER";
  const canEdit = isAdmin || isManager;

  // Estado para gerenciar as imagens
  const [media, setMedia] = useState<PropertyMedia[]>(property?.media || []);
  const [activeStep, setActiveStep] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(
      isEditMode ? updatePropertySchema : createPropertySchema
    ),
    defaultValues: {
      code: property?.code || "",
      title: property?.title || "",
      description: property?.description || "",
      type: property?.type || PropertyType.HOUSE,
      status: property?.status || PropertyStatus.ACTIVE,
      price: property?.price || undefined,
      bedroom: property?.bedroom || undefined,
      bathroom: property?.bathroom || undefined,
      parking: property?.parking || undefined,
      area: property?.area || undefined,
      address: property?.address
        ? {
            street: property.address.street,
            number: property.address.number,
            district: property.address.district,
            city: property.address.city,
            state: property.address.state,
            zip: property.address.zip,
            lat: property.address.lat,
            lng: property.address.lng,
          }
        : {
            street: "",
            number: "",
            district: "",
            city: "",
            state: "",
            zip: "",
          },
      features: property?.features || undefined,
      ownerId: property?.ownerId || undefined,
    },
  });

  // Watch dos valores do formulário para validação reativa
  const watchedValues = useWatch({ control: form.control });

  const onSubmit = async (
    data: CreatePropertyValues | UpdatePropertyValues
  ) => {
    // Verificar permissões para edição
    if (isEditMode && !canEdit) {
      toast.error("Acesso Negado", {
        description:
          "Apenas administradores e gerentes podem editar propriedades.",
      });
      return;
    }

    // Verificar autenticação para criação
    if (!isEditMode && !currentUser) {
      toast.error("Erro de Autenticação", {
        description: "Você precisa estar logado para criar propriedades.",
      });
      return;
    }

    try {
      // Transformar dados para o formato esperado pelo backend
      const dataWithMedia = {
        ...data,
        // Converter price para string com formato decimal esperado pelo @IsDecimal()
        price: data.price
          ? parseFloat(data.price.toString()).toFixed(2)
          : undefined,
        // Usar campos esperados pelo DTO do backend (CreateAddressDto)
        address: data.address
          ? {
              street: data.address.street || "",
              neighborhood: data.address.district || "", // usar neighborhood (campo do DTO)
              city: data.address.city || "",
              state: data.address.state || "",
              zipCode: data.address.zip || "", // usar zipCode (campo do DTO)
              country: "Brasil", // valor padrão
            }
          : {
              street: "",
              neighborhood: "",
              city: "",
              state: "",
              zipCode: "",
              country: "Brasil",
            },
        // Adicionar media aos dados (só se tivermos mídia)
        ...(media.length > 0 && {
          media: media.map((item) => ({
            url: item.url,
            alt: item.alt,
            isCover: item.isCover,
            order: item.order,
          })),
        }),
      };

      if (isEditMode && property) {
        await updatePropertyMutation.mutateAsync({
          id: property.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: dataWithMedia as any,
        });
        toast.success("Propriedade atualizada com sucesso!");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createPropertyMutation.mutateAsync(dataWithMedia as any);
        toast.success("Propriedade criada com sucesso!");
      }

      onSuccess?.();
    } catch {
      toast.error("Erro ao salvar propriedade. Tente novamente.");
    }
  };

  const isLoading =
    createPropertyMutation.isPending || updatePropertyMutation.isPending;

  // Verificar se deve mostrar o diálogo
  if (isEditMode && !canEdit) {
    return null;
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepCompleted = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          form.getValues("code") &&
          form.getValues("title") &&
          form.getValues("type")
        );
      case 1:
        return (
          form.getValues("bedroom") !== undefined ||
          form.getValues("area") !== undefined
        );
      case 2:
        return (
          form.getValues("address?.city") && form.getValues("address?.state")
        );
      case 3:
        return media.length > 0;
      default:
        return false;
    }
  };

  const isStepOptional = () => {
    return false; // Todos os steps são obrigatórios
  };

  const isCurrentStepValid = () => {
    switch (activeStep) {
      case 0:
        // Informações básicas - todos os campos são obrigatórios
        const code = watchedValues?.code;
        const title = watchedValues?.title;
        const type = watchedValues?.type;
        const status = watchedValues?.status;
        const price = watchedValues?.price;
        return code && title && type && status && price;

      case 1:
        // Características - todos os campos são obrigatórios
        const bedroom = watchedValues?.bedroom;
        const bathroom = watchedValues?.bathroom;
        const parking = watchedValues?.parking;
        const area = watchedValues?.area;
        return (
          bedroom !== undefined &&
          bedroom > 0 &&
          bathroom !== undefined &&
          bathroom > 0 &&
          parking !== undefined &&
          parking >= 0 &&
          area !== undefined &&
          area > 0
        );

      case 2:
        // Endereço - todos os campos são obrigatórios
        const street = watchedValues?.address?.street;
        const number = watchedValues?.address?.number;
        const district = watchedValues?.address?.district;
        const city = watchedValues?.address?.city;
        const state = watchedValues?.address?.state;
        const zip = watchedValues?.address?.zip;
        return street && number && district && city && state && zip;

      case 3:
        // Imagens - pelo menos uma imagem é obrigatória
        return media.length > 0;

      default:
        return false;
    }
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <BasicInfoStep form={form} />;
      case 1:
        return <CharacteristicsStep form={form} />;
      case 2:
        return <AddressStep form={form} />;
      case 3:
        return <MediaStep media={media} onMediaChange={setMedia} />;
      default:
        return "Step desconhecido";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Editar Propriedade" : "Criar Propriedade"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditMode
            ? "Edite as informações da propriedade."
            : "Crie uma nova propriedade no sistema."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Stepper */}
          <div className="container mx-auto max-w-screen-lg">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step
                  key={step.label}
                  completed={isStepCompleted(index)}
                  active={activeStep === index}
                  disabled={activeStep < index}
                >
                  <StepLabel>
                    <div className="flex flex-col items-center">
                      <StepIcon
                        active={activeStep === index}
                        completed={isStepCompleted(index)}
                      >
                        {isStepCompleted(index) ? "✓" : index + 1}
                      </StepIcon>
                      <div className="mt-2 text-center">
                        <div className="font-medium">{step.label}</div>
                        <div className="text-xs text-gray-500">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </StepLabel>
                  {index < steps.length - 1 && <StepConnector />}
                </Step>
              ))}
            </Stepper>
          </div>

          {/* Dica de campos obrigatórios */}
          {!isCurrentStepValid() && !isStepOptional() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Campos obrigatórios não preenchidos
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    {activeStep === 0 && (
                      <p>
                        Todos os campos são obrigatórios: código, título, tipo,
                        status e preço
                      </p>
                    )}
                    {activeStep === 1 && (
                      <p>
                        Todos os campos são obrigatórios: quartos, banheiros,
                        vagas e área
                      </p>
                    )}
                    {activeStep === 2 && (
                      <p>
                        Todos os campos são obrigatórios: rua, número, bairro,
                        cidade, estado e CEP
                      </p>
                    )}
                    {activeStep === 3 && (
                      <p>
                        É obrigatório adicionar pelo menos uma imagem da
                        propriedade
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          <StepContent>{getStepContent(activeStep)}</StepContent>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center min-w-[120px]"
                >
                  {isLoading ? (
                    <LoadingSpinner size={14} text="Salvando..." />
                  ) : (
                    "Salvar Propriedade"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className="relative"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                  {!isCurrentStepValid() && (
                    <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
