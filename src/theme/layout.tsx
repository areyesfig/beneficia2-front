import { View, ViewStyle, StyleProp } from "react-native";

/**
 * VStack / HStack (react-native-design skill - styling-patterns).
 * Layout con gap para espaciado consistente.
 */
interface StackProps {
  children: React.ReactNode;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

export function VStack({
  children,
  spacing = 8,
  style,
}: StackProps) {
  return <View style={[{ gap: spacing }, style]}>{children}</View>;
}

export function HStack({
  children,
  spacing = 8,
  style,
}: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
