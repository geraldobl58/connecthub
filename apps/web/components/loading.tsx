import { LoadingProps } from "@/types/loading";
import { LoadingFullScreen } from "./loading-fullscreen";
import { LoadingStyles } from "./loading-styles";
import { LoadingSpinner } from "./loading-spinner";
import { LoadingInline } from "./loading-inline";

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
