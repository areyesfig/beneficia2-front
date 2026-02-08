import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: string;
  variant?: ButtonVariant;
}

const containerStyles: Record<ButtonVariant, string> = {
  primary: "bg-teal-600 active:opacity-90",
  secondary: "bg-teal-50 border border-teal-100 active:opacity-90",
  outline: "border border-teal-200 bg-white active:opacity-90",
};

const textStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-teal-800",
  outline: "text-teal-700",
};

export function Button({
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = "rounded-2xl py-3.5 items-center justify-center";
  const variantClass = containerStyles[variant];
  const textClass = textStyles[variant];

  return (
    <Pressable
      className={`${base} ${variantClass} ${disabled ? "opacity-50" : ""} ${className ?? ""}`}
      disabled={disabled}
      {...props}
    >
      <Text className={`font-semibold ${textClass}`}>{children}</Text>
    </Pressable>
  );
}
