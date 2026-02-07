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
        <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text>
      ) : null}
      <TextInput
        className={`rounded-xl border bg-white px-4 py-3 text-base text-gray-900 ${
          hasError ? "border-red-500" : "border-gray-300"
        } ${className ?? ""}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error ? (
        <Text className="mt-1.5 text-sm text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}
