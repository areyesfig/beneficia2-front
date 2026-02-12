import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import {
  Home,
  Gift,
  CircleDollarSign,
  ChevronRight,
  GraduationCap,
  Heart,
  Baby,
  User,
  Rocket,
  type LucideIcon,
} from "lucide-react-native";
import { formatCurrency } from "@/utils/format-currency";
import { cardStyle } from "@/styles/screenStyles";
import { theme } from "@/theme/theme";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";
import type { BenefitCardProps } from "./BenefitCard";

const CATEGORY_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  VIVIENDA: { Icon: Home, bg: theme.colors.primaryTint, color: theme.colors.primary },
  BONOS_ESTATALES: { Icon: Gift, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  SALUD_Y_CUIDADOS: { Icon: Heart, bg: theme.colors.primaryTint, color: theme.colors.primary },
  SALUD: { Icon: Heart, bg: theme.colors.primaryTint, color: theme.colors.primary },
  NINEZ_Y_ADOLESCENCIA: { Icon: Baby, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  JUVENTUD_Y_ESTUDIOS: { Icon: GraduationCap, bg: theme.colors.primaryTint, color: theme.colors.primary },
  EDUCACION: { Icon: GraduationCap, bg: theme.colors.primaryTint, color: theme.colors.primary },
  ADULTO_MAYOR: { Icon: User, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  EMPRENDIMIENTO: { Icon: Rocket, bg: theme.colors.primaryTint, color: theme.colors.primary },
  default: { Icon: CircleDollarSign, bg: theme.colors.border, color: theme.colors.textSecondary },
};

function getCategoryStyle(category?: string) {
  if (!category) return CATEGORY_ICON.default;
  const key = category.toUpperCase().replace(/\s+/g, "_");
  return CATEGORY_ICON[key] ?? CATEGORY_ICON.default;
}

/**
 * Card compacta para vista Bento/Grid (ui-ux-pro-max).
 * Solo navegación al detalle; touch target ≥44px.
 */
export function BenefitCardCompact({
  id,
  title,
  amount,
  deadline,
  status,
  category,
}: BenefitCardProps) {
  const isEligible = status === "ELIGIBLE";
  const { Icon, bg, color } = getCategoryStyle(category);

  const content = (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: theme.spacing.xs }}>
        <View style={[{ width: 36, height: 36, borderRadius: theme.borderRadius.md, backgroundColor: bg, alignItems: "center", justifyContent: "center" }, cardStyle.wrapper]}>
          <Icon size={18} color={color} strokeWidth={2} />
        </View>
        <Text style={[theme.typography.caption, { fontWeight: "600", color: isEligible ? theme.colors.successText : theme.colors.warningText }]}>
          {isEligible ? "Disponible" : "Falta info"}
        </Text>
      </View>
      <Text style={[theme.typography.label, { color: theme.colors.text }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[theme.typography.bodySmall, { fontWeight: "600", color: theme.colors.primaryDark }]}>
        {formatCurrency(amount)}
      </Text>
      <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
        Vence: {deadline}
      </Text>
      <View style={{ position: "absolute", right: theme.spacing.sm, bottom: theme.spacing.sm }}>
        <ChevronRight size={20} color={theme.colors.textSecondary} strokeWidth={2} />
      </View>
    </>
  );

  const cardStyleInner = [
    { backgroundColor: theme.colors.surface, padding: theme.spacing.md, minHeight: 140 },
    cardStyle.wrapper,
    cardStyle.shadow,
  ];

  if (id) {
    const query = new URLSearchParams({
      title: title ?? "",
      status,
      deadline: deadline ?? "",
      amount: amount != null ? String(amount) : "",
    });
    const href = `/benefit/${id}?${query.toString()}`;
    return (
      <Link href={href} asChild>
        <AnimatedPressableScale style={cardStyleInner} accessibilityRole="button" accessibilityLabel={title}>
          {content}
        </AnimatedPressableScale>
      </Link>
    );
  }

  return <View style={cardStyleInner}>{content}</View>;
}
