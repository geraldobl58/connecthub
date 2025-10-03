"use client";

import { cn } from "@/lib/utils";
import "./stepper.css";

interface StepperProps {
  activeStep: number;
  orientation?: "horizontal" | "vertical";
  alternativeLabel?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Stepper({
  activeStep,
  orientation = "horizontal",
  alternativeLabel = false,
  className,
  children,
}: StepperProps) {
  return (
    <div
      className={cn(
        "stepper",
        orientation === "horizontal" ? "flex" : "flex flex-col",
        alternativeLabel && "stepper-alternative-label",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StepProps {
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Step({
  completed = false,
  active = false,
  disabled = false,
  className,
  children,
}: StepProps) {
  return (
    <div
      className={cn(
        "step relative",
        "flex items-center",
        completed && "step-completed",
        active && "step-active",
        disabled && "step-disabled opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StepLabelProps {
  optional?: React.ReactNode;
  error?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function StepLabel({
  optional,
  error = false,
  className,
  children,
}: StepLabelProps) {
  return (
    <div className={cn("step-label", error && "text-red-600", className)}>
      <span className="step-label-text">{children}</span>
      {optional && (
        <span className="step-label-optional text-xs text-gray-500 ml-1">
          {optional}
        </span>
      )}
    </div>
  );
}

interface StepConnectorProps {
  className?: string;
}

export function StepConnector({ className }: StepConnectorProps) {
  return (
    <div
      className={cn(
        "step-connector",
        "flex-1 h-0.5 bg-gray-200 mx-4",
        "step-connector-completed:bg-blue-500",
        className
      )}
    />
  );
}

interface StepContentProps {
  className?: string;
  children: React.ReactNode;
}

export function StepContent({ className, children }: StepContentProps) {
  return <div className={cn("step-content mt-4", className)}>{children}</div>;
}

interface StepButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function StepButton({
  onClick,
  disabled = false,
  className,
  children,
}: StepButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "step-button",
        "px-4 py-2 rounded-md border",
        "hover:bg-gray-50 transition-colors",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

interface StepIconProps {
  active?: boolean;
  completed?: boolean;
  error?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function StepIcon({
  active = false,
  completed = false,
  error = false,
  className,
  children,
}: StepIconProps) {
  const getIconClasses = () => {
    if (error) return "bg-red-500 text-white border-red-500";
    if (completed) return "bg-green-500 text-white border-green-500";
    if (active) return "bg-blue-500 text-white border-blue-500";
    return "bg-gray-200 text-gray-600 border-gray-300";
  };

  return (
    <div
      className={cn(
        "step-icon",
        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
        "transition-all duration-200",
        getIconClasses(),
        className
      )}
    >
      {children}
    </div>
  );
}
