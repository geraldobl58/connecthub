"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CepInput } from "@/components/ui/cep-input";
import { UseFormReturn } from "react-hook-form";
import { CreatePropertyValues, UpdatePropertyValues } from "@/schemas/property";
import { useViaCep } from "@/hooks/use-viacep";
import { ViaCepResponse } from "@/types/viacep";

interface AddressStepProps {
  form: UseFormReturn<CreatePropertyValues | UpdatePropertyValues>;
}

export function AddressStep({ form }: AddressStepProps) {
  const viaCep = useViaCep();

  const handleAddressFound = (addressData: ViaCepResponse) => {
    // Preenche automaticamente os campos com os dados do CEP
    form.setValue("address.street", addressData.logradouro);
    form.setValue("address.district", addressData.bairro);
    form.setValue("address.city", addressData.localidade);
    form.setValue("address.state", addressData.uf);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-sm font-semibold">3</span>
          </div>
          Endereço
        </CardTitle>
        <CardDescription>
          Digite o CEP para preenchimento automático dos campos de endereço.
          Você precisará informar apenas o número da propriedade.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="address.zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP *</FormLabel>
              <FormControl>
                <CepInput
                  placeholder="00000-000"
                  value={field.value ?? ""}
                  onChange={(value) => field.onChange(value)}
                  onAddressFound={handleAddressFound}
                  viaCep={viaCep}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro * (preenchido automaticamente)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Centro"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade * (preenchida automaticamente)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="São Paulo"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado * (preenchido automaticamente)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SP"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua * (preenchida automaticamente)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Rua das Flores"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
