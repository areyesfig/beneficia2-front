import { Platform, ViewStyle } from "react-native";

/**
 * Tema de diseño (react-native-design skill).
 * Paleta moderna: indigo/violeta + neutros cálidos.
 */
export const theme = {
  colors: {
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    secondary: "#818cf8",
    primaryTint: "#e0e7ff",
    primaryTintBorder: "#c7d2fe",
    background: "#f0f0f5",
    surface: "#ffffff",
    text: "#1e1b4b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    error: "#dc2626",
    errorTint: "#fee2e2",
    success: "#059669",
    successTint: "#d1fae5",
    successText: "#065f46",
    warning: "#d97706",
    warningTint: "#fef3c7",
    warningText: "#92400e",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: "600" as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
    bodySmall: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
    label: { fontSize: 14, fontWeight: "500" as const, lineHeight: 20 },
  },
};

/** Sombras cross-platform (styling-patterns.md) */
export function createShadow(
  elevation: number,
  color: string = "#000000"
): ViewStyle {
  if (Platform.OS === "android") {
    return { elevation: Math.max(elevation, 3), shadowColor: color };
  }
  const shadowMap: Record<number, ViewStyle> = {
    1: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
    },
    2: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.14,
      shadowRadius: 4,
    },
    4: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 10,
    },
    8: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    },
  };
  return shadowMap[Math.min(elevation, 8)] ?? shadowMap[4];
}

export const shadows = {
  sm: createShadow(2),
  md: createShadow(4),
  lg: createShadow(8),
};
