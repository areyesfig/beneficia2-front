import React from "react";
import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={`rounded-3xl border border-teal-100 bg-white p-5 shadow-lg ${className ?? ""}`}
      {...props}
    >
      {children}
    </View>
  );
}
