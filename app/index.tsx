import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, CheckCircle2 } from "lucide-react-native";
import { theme } from "@/theme/theme";
import { buttonStyle } from "@/styles/screenStyles";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";

/**
 * Primera pantalla (landing): hero, valor, beneficios y CTA.
 * Basado en .agents/skills: react-native-design (StyleSheet, Reanimated), ui-ux-pro-max (hero + CTA, touch 44px, contraste).
 */
const BENEFITS = [
  "Beneficios del Estado según tu perfil",
  "Tramo RSH e ingresos para elegibilidad",
  "Enlace directo a la página oficial para postular",
];

export default function IndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNarrow = width < 380;

  const handleCta = () => router.push("/wizard");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={[styles.container, isNarrow && styles.containerNarrow]}>
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Wallet size={40} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Beneficia2</Text>
          <Text style={styles.subtitle}>
            Encuentra beneficios del Estado según tu tramo RSH e ingresa a la página oficial para postular.
          </Text>
        </View>

        <View style={styles.benefits}>
          {BENEFITS.map((label, i) => (
            <View key={i} style={styles.benefitRow}>
              <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />
              <Text style={styles.benefitText}>{label}</Text>
            </View>
          ))}
        </View>

        <AnimatedPressableScale
          onPress={handleCta}
          style={[styles.cta, buttonStyle.rounded, buttonStyle.shadowPrimary]}
          accessibilityRole="button"
          accessibilityLabel="Ver mis beneficios"
        >
          <Text style={styles.ctaLabel}>Ver mis beneficios</Text>
        </AnimatedPressableScale>

        <Text style={styles.footnote}>
          Ingresa tu tramo RSH y datos; te mostramos beneficios y el enlace para postular en la página del beneficio.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    justifyContent: "center",
    maxWidth: 440,
    alignSelf: "center",
    width: "100%",
  },
  containerNarrow: {
    paddingHorizontal: theme.spacing.md,
  },
  hero: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: theme.spacing.xs,
  },
  benefits: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  benefitText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    flex: 1,
  },
  cta: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 52,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaLabel: {
    ...theme.typography.label,
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },
  footnote: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
});
