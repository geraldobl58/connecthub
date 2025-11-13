export type ColorType = "blue" | "red" | "green" | "white" | "gray";

export const colorConfig: Record<
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
