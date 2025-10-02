import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 16,
  text = "Carregando...",
  className,
}: LoadingSpinnerProps) {
  const sizeClass =
    {
      14: "h-3.5 w-3.5",
      16: "h-4 w-4",
      20: "h-5 w-5",
      24: "h-6 w-6",
      32: "h-8 w-8",
    }[size] || "h-4 w-4";

  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Loader2 className={`animate-spin mr-2 ${sizeClass}`} />
      <span>{text}</span>
    </div>
  );
}
