import React from "react";
import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={`rounded-xl bg-white p-4 shadow-md ${className ?? ""}`}
      {...props}
    >
      {children}
    </View>
  );
}
