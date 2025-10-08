import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm } from "react-hook-form";
import type { UseFormProps, FieldValues } from "react-hook-form";
import type { ZodSchema } from "zod";

interface UseFormParams<T extends FieldValues>
  extends Omit<UseFormProps<T>, "resolver"> {
  schema: ZodSchema<T>;
}

export function useForm<T extends FieldValues>({
  schema,
  ...props
}: UseFormParams<T>) {
  return useReactHookForm<T>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    ...props,
  });
}

// Re-export tipos úteis do react-hook-form
export type {
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
  Control,
  FieldError,
  FieldErrors,
  UseFormReturn,
  Path,
  PathValue,
} from "react-hook-form";

// Re-export componentes úteis do react-hook-form
export {
  Controller,
  FormProvider,
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
