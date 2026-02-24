import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import {
  Wallet,
  FileCheck,
  ChevronRight,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react-native";
import { theme, createShadow } from "@/theme/theme";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";
import { clearWizardData } from "@/features/profile/wizardStorage";

export default function HomeScreen() {
  const router = useRouter();

  const handleActualizarPerfil = () => {
    Alert.alert(
      "Actualizar datos",
      "Se borrarán los datos guardados. Podrás volver a ingresarlos desde el inicio. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          onPress: async () => {
            await clearWizardData();
            router.replace("/wizard");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header / Greeting */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>Hola 👋</Text>
            <Text style={styles.subtitle}>
              Descubre qué beneficios puedes obtener
            </Text>
          </View>
        </View>
      </View>

      {/* Highlight stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.successTint }]}>
            <Shield size={18} color={theme.colors.success} strokeWidth={2.2} />
          </View>
          <Text style={styles.statLabel}>Seguro</Text>
          <Text style={styles.statCaption}>Datos protegidos</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.warningTint }]}>
            <TrendingUp size={18} color={theme.colors.warning} strokeWidth={2.2} />
          </View>
          <Text style={styles.statLabel}>Personalizado</Text>
          <Text style={styles.statCaption}>Según tu perfil</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.primaryTint }]}>
            <Clock size={18} color={theme.colors.primary} strokeWidth={2.2} />
          </View>
          <Text style={styles.statLabel}>Al día</Text>
          <Text style={styles.statCaption}>Datos actualizados</Text>
        </View>
      </View>

      {/* Main action: Ver beneficios */}
      <Text style={styles.sectionTitle}>Acciones</Text>

      <AnimatedPressableScale
        onPress={() => router.push("/benefits")}
        style={styles.primaryCard}
        accessibilityRole="button"
        accessibilityLabel="Ver beneficios"
      >
        <View style={styles.primaryCardInner}>
          <View style={styles.primaryIconWrap}>
            <Wallet size={26} color="#fff" strokeWidth={2.2} />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.primaryCardTitle}>Ver beneficios</Text>
            <Text style={styles.primaryCardDesc}>
              Elegibilidad y montos según tu perfil
            </Text>
          </View>
          <View style={styles.chevronWrap}>
            <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
          </View>
        </View>
      </AnimatedPressableScale>

      {/* Secondary action: Actualizar perfil */}
      <AnimatedPressableScale
        onPress={handleActualizarPerfil}
        style={styles.secondaryCard}
        accessibilityRole="button"
        accessibilityLabel="Actualizar perfil"
      >
        <View style={styles.secondaryCardInner}>
          <View style={styles.secondaryIconWrap}>
            <FileCheck size={24} color={theme.colors.primary} strokeWidth={2.2} />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.secondaryCardTitle}>Actualizar perfil</Text>
            <Text style={styles.secondaryCardDesc}>
              Modificar datos del Registro Social de Hogares
            </Text>
          </View>
          <View style={styles.chevronSecondaryWrap}>
            <ChevronRight size={20} color={theme.colors.primary} strokeWidth={2.5} />
          </View>
        </View>
      </AnimatedPressableScale>

      {/* Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          💡 Mantén tu perfil actualizado para recibir resultados más precisos sobre los beneficios a los que puedes acceder.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 22,
  },

  /* Stats row */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 24,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    ...createShadow(2, "#94a3b8"),
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  statCaption: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },

  /* Section title */
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  /* Primary card (Ver beneficios) */
  primaryCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    marginBottom: 12,
    ...createShadow(6, theme.colors.primary),
  },
  primaryCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  primaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },
  primaryCardDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    lineHeight: 18,
  },

  /* Secondary card (Actualizar perfil) */
  secondaryCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
    ...createShadow(2, "#94a3b8"),
  },
  secondaryCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  secondaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryCardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
  },
  secondaryCardDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },

  /* Shared card text */
  cardTextWrap: {
    flex: 1,
  },

  /* Chevrons */
  chevronWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronSecondaryWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Tip */
  tipCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: theme.colors.warningTint,
    borderRadius: 12,
    padding: 14,
  },
  tipText: {
    fontSize: 13,
    color: theme.colors.warningText,
    lineHeight: 20,
  },
});
