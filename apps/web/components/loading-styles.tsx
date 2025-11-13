import { colorConfig } from "@/lib/loading-colors";
import { LoadingStylesProps } from "@/types/loading";

export const LoadingStyles = ({ color = "blue" }: LoadingStylesProps) => {
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
