import { Zap } from "lucide-react";

import { colorConfig } from "@/lib/loading-colors";
import { LoadingProps } from "@/types/loading";
import { LoadingStyles } from "./loading-styles";

export const LoadingFullScreen = ({
  title,
  message,
  size = 32,
  color = "blue",
}: LoadingProps) => {
  const config = colorConfig[color];

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <LoadingStyles color={color} />
      <div className="flex flex-col items-center gap-6">
        {/* Spinner com ícone giratório */}
        <div className="relative w-20 h-20">
          {/* Círculo de fundo */}
          <div
            className={`absolute inset-0 rounded-full border-4 ${config.bgClass}`}
          ></div>

          {/* Borda animada */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-transparent ${config.borderClass} spin-icon`}
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

        {/* Texto de loading */}
        <div className="text-center">
          <p className="text-gray-700 font-medium">{title}</p>
          <p className="text-sm text-gray-500 mt-2">{message}</p>
        </div>
      </div>
    </div>
  );
};
