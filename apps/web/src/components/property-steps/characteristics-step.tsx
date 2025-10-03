"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CreatePropertyValues, UpdatePropertyValues } from "@/schemas/property";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

interface CharacteristicsStepProps {
  form: UseFormReturn<CreatePropertyValues | UpdatePropertyValues>;
}

export function CharacteristicsStep({ form }: CharacteristicsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm font-semibold">2</span>
          </div>
          Características
        </CardTitle>
        <CardDescription>
          Detalhes específicos da propriedade como quartos, banheiros e área
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="bedroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartos *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banheiros *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vagas *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área (m²) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="120.5"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
