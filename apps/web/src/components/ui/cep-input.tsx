"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UseViaCepReturn } from "@/hooks/use-viacep";

export interface CepInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onAddressFound?: (address: {
    street: string;
    district: string;
    city: string;
    state: string;
  }) => void;
  viaCep: UseViaCepReturn;
}

const CepInput = React.forwardRef<HTMLInputElement, CepInputProps>(
  (
    { className, value, onChange, onAddressFound, viaCep, onBlur, ...props },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>(value ?? "");

    useEffect(() => {
      setDisplayValue(value ?? "");
    }, [value]);

    const formatCep = (inputValue: string): string => {
      const numericValue = inputValue.replace(/\D/g, "");
      if (numericValue.length <= 5) {
        return numericValue;
      }
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formattedValue = formatCep(inputValue);

      setDisplayValue(formattedValue);
      onChange?.(inputValue.replace(/\D/g, ""));
    };

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);

      const cleanedCep = displayValue.replace(/\D/g, "");
      if (cleanedCep.length === 8) {
        const addressData = await viaCep.searchAddress(cleanedCep);
        if (addressData && onAddressFound) {
          onAddressFound({
            street: addressData.logradouro,
            district: addressData.bairro,
            city: addressData.localidade,
            state: addressData.uf,
          });
        }
      }
    };

    return (
      <div className="relative">
        <input
          type="text"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="00000-000"
          maxLength={9}
          {...props}
        />

        {viaCep.isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);

CepInput.displayName = "CepInput";

export { CepInput };
