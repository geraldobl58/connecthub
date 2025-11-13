import { Zap } from "lucide-react";

import { colorConfig } from "@/lib/loading-colors";
import { LoadingSpinnerProps } from "@/types/loading";

export const LoadingSpinner = ({
  size = 20,
  color = "blue",
}: LoadingSpinnerProps) => {
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
