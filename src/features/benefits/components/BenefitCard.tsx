import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Link } from "expo-router";
import {
  Home,
  Gift,
  Briefcase,
  CircleDollarSign,
  ChevronRight,
  GraduationCap,
  Heart,
  Baby,
  User,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Calendar,
  type LucideIcon,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { formatCurrency } from "@/utils/format-currency";
import { buttonStyle } from "@/styles/screenStyles";
import { theme, createShadow } from "@/theme/theme";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";

export type BenefitStatus = "ELIGIBLE" | "MISSING_DATA";
export type ApplicationActionStatus = "APPLIED" | "DISMISSED";

export interface BenefitCardProps {
  id?: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  deadline: string;
  status: BenefitStatus;
  category?: string;
  urlApply?: string | null;
  missingLabels?: string[];
  requiresApplication?: boolean;
  onPostular?: () => void;
  onAction?: (benefitId: string, status: ApplicationActionStatus) => void;
  onCompletarPerfil?: () => void;
  /** Index for staggered animation */
  index?: number;
}

/* ── Category colors (differentiated per category) ── */
const CATEGORY_MAP: Record<
  string,
  { Icon: LucideIcon; bg: string; color: string; accent: string }
> = {
  VIVIENDA: {
    Icon: Home,
    bg: "#ede9fe",
    color: "#7c3aed",
    accent: "#7c3aed",
  },
  BONOS_ESTATALES: {
    Icon: Gift,
    bg: "#fce7f3",
    color: "#db2777",
    accent: "#db2777",
  },
  BONOS_Y_PENSIONES: {
    Icon: Gift,
    bg: "#fce7f3",
    color: "#db2777",
    accent: "#db2777",
  },
  CAPACITACION_Y_EMPLEO: {
    Icon: Briefcase,
    bg: "#dbeafe",
    color: "#2563eb",
    accent: "#2563eb",
  },
  SALUD_Y_CUIDADOS: {
    Icon: Heart,
    bg: "#fce4ec",
    color: "#e11d48",
    accent: "#e11d48",
  },
  SALUD: {
    Icon: Heart,
    bg: "#fce4ec",
    color: "#e11d48",
    accent: "#e11d48",
  },
  NINEZ_Y_ADOLESCENCIA: {
    Icon: Baby,
    bg: "#fff7ed",
    color: "#ea580c",
    accent: "#ea580c",
  },
  JUVENTUD_Y_ESTUDIOS: {
    Icon: GraduationCap,
    bg: "#ecfdf5",
    color: "#059669",
    accent: "#059669",
  },
  EDUCACION: {
    Icon: GraduationCap,
    bg: "#ecfdf5",
    color: "#059669",
    accent: "#059669",
  },
  ADULTO_MAYOR: {
    Icon: User,
    bg: "#f0f9ff",
    color: "#0284c7",
    accent: "#0284c7",
  },
  EMPRENDIMIENTO: {
    Icon: Rocket,
    bg: "#fef3c7",
    color: "#d97706",
    accent: "#d97706",
  },
  default: {
    Icon: CircleDollarSign,
    bg: theme.colors.border,
    color: theme.colors.textSecondary,
    accent: theme.colors.textSecondary,
  },
};

function getCat(category?: string) {
  if (!category) return CATEGORY_MAP.default;
  const key = category.toUpperCase().replace(/\s+/g, "_");
  return CATEGORY_MAP[key] ?? CATEGORY_MAP.default;
}

const MAX_DESC_LEN = 800;

export function BenefitCard({
  id,
  title,
  description,
  amount,
  deadline,
  status,
  category,
  urlApply,
  missingLabels,
  requiresApplication = true,
  onPostular,
  onAction,
  onCompletarPerfil,
  index = 0,
}: BenefitCardProps) {
  const isEligible = status === "ELIGIBLE";
  const hasMissing = (missingLabels?.length ?? 0) > 0;
  const { Icon, bg, color, accent } = getCat(category);

  const cardContent = (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
      {/* Top row: icon + badge */}
      <View style={s.topRow}>
        <View style={[s.iconCircle, { backgroundColor: bg }]}>
          <Icon size={22} color={color} strokeWidth={2.2} />
        </View>
        <View
          style={[
            s.statusBadge,
            {
              backgroundColor: isEligible
                ? theme.colors.successTint
                : theme.colors.warningTint,
            },
          ]}
        >
          {isEligible ? (
            <CheckCircle2 size={13} color={theme.colors.success} strokeWidth={2.5} />
          ) : (
            <AlertCircle size={13} color={theme.colors.warning} strokeWidth={2.5} />
          )}
          <Text
            style={[
              s.statusText,
              {
                color: isEligible
                  ? theme.colors.successText
                  : theme.colors.warningText,
              },
            ]}
          >
            {isEligible ? "Elegible" : "Falta info"}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={s.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Missing labels */}
      {hasMissing && (
        <Text style={s.missingText} numberOfLines={2}>
          Te falta: {missingLabels!.slice(0, 3).join(", ")}
        </Text>
      )}

      {/* Amount + deadline row */}
      <View style={s.infoRow}>
        <View style={s.amountWrap}>
          <Text style={[s.amount, { color: accent }]}>
            {formatCurrency(amount)}
          </Text>
          <Text style={s.amountLabel}>monto estimado</Text>
        </View>
        <View style={s.deadlineWrap}>
          <Calendar size={13} color={theme.colors.textSecondary} strokeWidth={2} />
          <Text style={s.deadline}>{deadline}</Text>
        </View>
      </View>

      {/* Progress bar for missing data */}
      {!isEligible && (
        <View style={s.progressSection}>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: "50%", backgroundColor: theme.colors.warning }]} />
          </View>
          <Text style={s.progressLabel}>1 de 2 requisitos</Text>
        </View>
      )}

      {/* CTA / chevron */}
      <View style={s.ctaRow}>
        {!requiresApplication ? (
          <View style={[s.ctaButton, { backgroundColor: accent }]}>
            <Text style={s.ctaText}>Ver más información</Text>
            <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
          </View>
        ) : (
          <View style={s.chevronRow}>
            <Text style={[s.detailHint, { color: accent }]}>Ver detalle</Text>
            <View style={[s.chevronCircle, { backgroundColor: bg }]}>
              <ChevronRight size={16} color={accent} strokeWidth={2.5} />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const wrappedContent = (
    <View style={[s.card, s.cardShadow]}>
      {cardContent}
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
        <AnimatedPressableScale>
          {wrappedContent}
        </AnimatedPressableScale>
      </Link>
    );
  }

  return (
    <AnimatedPressableScale onPress={onPostular}>
      {wrappedContent}
    </AnimatedPressableScale>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  cardShadow: {
    ...createShadow(6, "#64748b"),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  /* Top row */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* Title */
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  /* Missing */
  missingText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },

  /* Info row */
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 4,
  },
  amountWrap: {
    flex: 1,
  },
  amount: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  amountLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deadlineWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deadline: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },

  /* Progress */
  progressSection: {
    marginTop: 16,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  /* CTA row */
  ctaRow: {
    marginTop: 18,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 6,
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  chevronRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  detailHint: {
    fontSize: 13,
    fontWeight: "600",
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
