import { Zap } from "lucide-react";

import { colorConfig } from "@/lib/loading-colors";

import { LoadingStyles } from "./loading-styles";

import { LoadingProps } from "@/types/loading";

export const LoadingInline = ({
  title,
  message,
  size = 24,
  color = "blue",
}: LoadingProps) => {
  const config = colorConfig[color];

  return (
    <div className="flex flex-col items-center gap-4">
      <LoadingStyles color={color} />
      <div className="relative w-16 h-16">
        {/* Círculo de fundo */}
        <div
          className={`absolute inset-0 rounded-full border-3 ${config.bgClass}`}
        ></div>

        {/* Borda animada */}
        <div
          className={`absolute inset-0 rounded-full border-3 border-transparent ${config.borderClass} spin-icon`}
        ></div>

        {/* Ícone no centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap
            className={`${config.textClass} pulse-glow`}
            size={size}
            strokeWidth={2}
          />
        </div>
      </div>

      {title && (
        <div className="text-center">
          <p className="text-gray-700 font-medium text-sm">{title}</p>
          {message && <p className="text-xs text-gray-500 mt-1">{message}</p>}
        </div>
      )}
    </div>
  );
};
