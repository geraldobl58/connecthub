import { Zap } from "lucide-react";

type ColorType = "blue" | "red" | "green" | "white" | "gray";

interface LoadingProps {
  title?: string;
  message?: string;
  size?: number;
  variant?: "fullscreen" | "inline" | "button";
  fullscreen?: boolean;
  color?: ColorType;
}

// Color mapping for animations and styles
const colorConfig: Record<
  ColorType,
  { textClass: string; borderClass: string; bgClass: string; rgbValue: string }
> = {
  blue: {
    textClass: "text-blue-600",
    borderClass: "border-t-blue-600 border-r-blue-500",
    bgClass: "border-slate-200",
    rgbValue: "rgba(37, 99, 235, 0.6)",
  },
  red: {
    textClass: "text-red-600",
    borderClass: "border-t-red-600 border-r-red-500",
    bgClass: "border-red-100",
    rgbValue: "rgba(220, 38, 38, 0.6)",
  },
  green: {
    textClass: "text-green-600",
    borderClass: "border-t-green-600 border-r-green-500",
    bgClass: "border-green-100",
    rgbValue: "rgba(22, 163, 74, 0.6)",
  },
  white: {
    textClass: "text-white",
    borderClass: "border-t-white border-r-gray-100",
    bgClass: "border-gray-300",
    rgbValue: "rgba(255, 255, 255, 0.6)",
  },
  gray: {
    textClass: "text-gray-600",
    borderClass: "border-t-gray-600 border-r-gray-500",
    bgClass: "border-gray-200",
    rgbValue: "rgba(75, 85, 99, 0.6)",
  },
};

interface LoadingStylesProps {
  color?: ColorType;
}

const LoadingStyles = ({ color = "blue" }: LoadingStylesProps) => {
  const config = colorConfig[color];
  const rgbLight = config.rgbValue.replace(", 0.6)", ", 0.9)");

  return (
    <style>{`
      @keyframes spin-icon {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse-glow {
        0%, 100% {
          opacity: 1;
          filter: drop-shadow(0 0 8px ${config.rgbValue});
        }
        50% {
          opacity: 0.8;
          filter: drop-shadow(0 0 16px ${rgbLight});
        }
      }

      @keyframes pulse-mini {
        0%, 100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(1.05) rotate(180deg);
          opacity: 0.9;
        }
      }

      .spin-icon {
        animation: spin-icon 2s linear infinite;
      }

      .pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .pulse-mini {
        animation: pulse-mini 1.2s ease-in-out infinite;
      }
    `}</style>
  );
};

interface LoadingSpinnerProps {
  size?: number;
  color?: ColorType;
}

const LoadingSpinner = ({ size = 20, color = "blue" }: LoadingSpinnerProps) => {
  const config = colorConfig[color];

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <Zap
        className={`${config.textClass} pulse-mini`}
        size={size}
        strokeWidth={2.5}
      />
    </div>
  );
};

const LoadingFullScreen = ({
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

const LoadingInline = ({
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

export const Loading = ({
  title,
  message,
  size,
  variant = "fullscreen",
  fullscreen = false,
  color = "blue",
}: LoadingProps) => {
  // Se fullscreen prop for true, usar fullscreen
  if (fullscreen) {
    return (
      <LoadingFullScreen
        title={title}
        message={message}
        size={size}
        color={color}
      />
    );
  }

  // Se não há título e tamanho é pequeno, é modo button
  if (!title && !message && typeof size === "number") {
    return (
      <>
        <LoadingStyles color={color} />
        <LoadingSpinner size={size} color={color} />
      </>
    );
  }

  // Usar variant
  switch (variant) {
    case "button":
      return (
        <>
          <LoadingStyles color={color} />
          <LoadingSpinner size={size} color={color} />
        </>
      );
    case "inline":
      return (
        <LoadingInline
          title={title}
          message={message}
          size={size}
          color={color}
        />
      );
    case "fullscreen":
    default:
      return (
        <LoadingFullScreen
          title={title}
          message={message}
          size={size}
          color={color}
        />
      );
  }
};
