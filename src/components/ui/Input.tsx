import React from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <View>
      {label ? (
        <Text className="mb-1.5 text-sm font-medium text-slate-600">{label}</Text>
      ) : null}
      <TextInput
        className={`rounded-2xl border bg-white px-4 py-3 text-base text-slate-800 ${
          hasError ? "border-red-500" : "border-teal-200"
        } ${className ?? ""}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error ? (
        <Text className="mt-1.5 text-sm text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}
