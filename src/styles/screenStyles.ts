import { StyleSheet, Platform } from "react-native";
import { theme, createShadow } from "@/theme/theme";

/**
 * Estilos compartidos (react-native-design + Vercel ui-styling).
 * borderCurve para iOS, sombras cross-platform desde theme.
 */
export const cardStyle = StyleSheet.create({
  wrapper: {
    borderRadius: theme.borderRadius.lg,
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  shadow: {
    ...createShadow(4, "#64748b"),
  },
  shadowStrong: {
    ...createShadow(6, theme.colors.primary),
  },
});

export const buttonStyle = StyleSheet.create({
  rounded: {
    borderRadius: theme.borderRadius.md,
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  shadowPrimary: {
    ...createShadow(3, theme.colors.primary),
  },
});

export const chipStyle = StyleSheet.create({
  rounded: {
    borderRadius: theme.borderRadius.full,
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  shadow: {
    ...createShadow(3, theme.colors.primary),
  },
});
