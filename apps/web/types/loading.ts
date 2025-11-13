import { ColorType } from "@/lib/loading-colors";

export interface LoadingProps {
  title?: string;
  message?: string;
  size?: number;
  variant?: "fullscreen" | "inline" | "button";
  fullscreen?: boolean;
  color?: ColorType;
}

export interface LoadingStylesProps {
  color?: ColorType;
}
export interface LoadingSpinnerProps {
  size?: number;
  color?: ColorType;
}
