import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: string;
  variant?: ButtonVariant;
}

const containerStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 active:opacity-90",
  secondary: "bg-gray-100 active:opacity-90",
  outline: "border border-gray-300 bg-white active:opacity-90",
};

const textStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-gray-800",
  outline: "text-gray-700",
};

export function Button({
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = "rounded-xl py-3.5 items-center justify-center";
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
