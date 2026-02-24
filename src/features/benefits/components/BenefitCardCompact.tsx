import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Link } from "expo-router";
import {
  Home,
  Gift,
  Briefcase,
  CircleDollarSign,
  GraduationCap,
  Heart,
  Baby,
  User,
  Rocket,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { formatCurrency } from "@/utils/format-currency";
import { theme, createShadow } from "@/theme/theme";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";
import type { BenefitCardProps } from "./BenefitCard";

/* ── Category map (same palette as BenefitCard) ── */
const CATEGORY_MAP: Record<
  string,
  { Icon: LucideIcon; bg: string; color: string; accent: string }
> = {
  VIVIENDA: { Icon: Home, bg: "#ede9fe", color: "#7c3aed", accent: "#7c3aed" },
  BONOS_ESTATALES: { Icon: Gift, bg: "#fce7f3", color: "#db2777", accent: "#db2777" },
  BONOS_Y_PENSIONES: { Icon: Gift, bg: "#fce7f3", color: "#db2777", accent: "#db2777" },
  CAPACITACION_Y_EMPLEO: { Icon: Briefcase, bg: "#dbeafe", color: "#2563eb", accent: "#2563eb" },
  SALUD_Y_CUIDADOS: { Icon: Heart, bg: "#fce4ec", color: "#e11d48", accent: "#e11d48" },
  SALUD: { Icon: Heart, bg: "#fce4ec", color: "#e11d48", accent: "#e11d48" },
  NINEZ_Y_ADOLESCENCIA: { Icon: Baby, bg: "#fff7ed", color: "#ea580c", accent: "#ea580c" },
  JUVENTUD_Y_ESTUDIOS: { Icon: GraduationCap, bg: "#ecfdf5", color: "#059669", accent: "#059669" },
  EDUCACION: { Icon: GraduationCap, bg: "#ecfdf5", color: "#059669", accent: "#059669" },
  ADULTO_MAYOR: { Icon: User, bg: "#f0f9ff", color: "#0284c7", accent: "#0284c7" },
  EMPRENDIMIENTO: { Icon: Rocket, bg: "#fef3c7", color: "#d97706", accent: "#d97706" },
  default: { Icon: CircleDollarSign, bg: theme.colors.border, color: theme.colors.textSecondary, accent: theme.colors.textSecondary },
};

function getCat(category?: string) {
  if (!category) return CATEGORY_MAP.default;
  const key = category.toUpperCase().replace(/\s+/g, "_");
  return CATEGORY_MAP[key] ?? CATEGORY_MAP.default;
}

const MAX_DESC_LEN = 800;

export function BenefitCardCompact({
  id,
  title,
  description,
  amount,
  deadline,
  status,
  category,
  index = 0,
}: BenefitCardProps) {
  const isEligible = status === "ELIGIBLE";
  const { Icon, bg, color, accent } = getCat(category);

  const content = (
    <Animated.View entering={FadeInUp.delay(100 + index * 60).duration(350).springify()}>
      {/* Icon + status dot */}
      <View style={s.topRow}>
        <View style={[s.iconCircle, { backgroundColor: bg }]}>
          <Icon size={18} color={color} strokeWidth={2.2} />
        </View>
        <View
          style={[
            s.statusDot,
            {
              backgroundColor: isEligible
                ? theme.colors.success
                : theme.colors.warning,
            },
          ]}
        />
      </View>

      {/* Title */}
      <Text style={s.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Amount */}
      <Text style={[s.amount, { color: accent }]}>
        {formatCurrency(amount)}
      </Text>

      {/* Deadline + status label */}
      <View style={s.bottomRow}>
        <Text style={s.deadline} numberOfLines={1}>
          {deadline}
        </Text>
        {isEligible ? (
          <CheckCircle2 size={14} color={theme.colors.success} strokeWidth={2.2} />
        ) : (
          <AlertCircle size={14} color={theme.colors.warning} strokeWidth={2.2} />
        )}
      </View>
    </Animated.View>
  );

  const wrappedContent = (
    <View style={[s.card, s.cardShadow]}>
      {content}
    </View>
  );

  if (id) {
    const descParam = description?.trim();
    const query = new URLSearchParams({
      title: title ?? "",
      status,
      deadline: deadline ?? "",
      amount: amount != null ? String(amount) : "",
      ...(descParam
        ? {
            description:
              descParam.length > MAX_DESC_LEN
                ? descParam.slice(0, MAX_DESC_LEN) + "\u2026"
                : descParam,
          }
        : {}),
    });
    const href = `/benefit/${id}?${query.toString()}`;
    return (
      <Link href={href} asChild>
        <AnimatedPressableScale
          accessibilityRole="button"
          accessibilityLabel={title}
        >
          {wrappedContent}
        </AnimatedPressableScale>
      </Link>
    );
  }

  return wrappedContent;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 14,
    minHeight: 170,
    justifyContent: "space-between",
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  cardShadow: {
    ...createShadow(6, "#64748b"),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 19,
    letterSpacing: -0.2,
    marginBottom: 6,
  },

  amount: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deadline: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
});
