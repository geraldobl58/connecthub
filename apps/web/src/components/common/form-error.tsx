interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <p className={`text-red-700 text-xs mt-1 ${className || ""}`}>{error}</p>
  );
}
