import { BenefitsFeed } from "@/features/benefits/components/BenefitsFeed";
import type { BenefitItem } from "@/features/benefits/components/BenefitsFeed";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Flame,
  BadgeDollarSign,
  Home,
  HeartPulse,
  Baby,
  GraduationCap,
  User,
  Rocket,
  Briefcase,
  LayoutGrid,
  List,
  Search,
  type LucideIcon,
} from "lucide-react-native";
import { useState, useMemo, useEffect } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  useUserMatches,
  mapMatchesToBenefitItems,
} from "@/features/benefits/api/useUserMatches";
import { getProfile } from "@/features/profile/api/profileApi";
import {
  BENEFIT_CATEGORIES,
  normalizeCategoryForFilter,
  type BenefitCategoryId,
} from "@/constants/categories";
import { apiClient } from "@/api";
import { useAuthStore } from "@/features/auth/authStore";
import { theme, createShadow } from "@/theme/theme";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";
import { BenefitsGrid } from "@/features/benefits/components/BenefitsGrid";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Flame,
  BadgeDollarSign,
  Home,
  HeartPulse,
  Baby,
  GraduationCap,
  User,
  Rocket,
  Briefcase,
};

const USE_MOCK_FOR_TESTING = false;

const MOCK_BENEFITS: BenefitItem[] = [
  { id: "mock-1", title: "Bono al Trabajo de la Mujer", description: "Bono mensual para mujeres que trabajen de forma dependiente o independiente y pertenezcan a los tramos más vulnerables. Monto de $98.750 por carga familiar elegible.", amount: 98750, deadline: "31 Mar 2025", status: "ELIGIBLE", category: "CAPACITACION_Y_EMPLEO" },
  { id: "mock-2", title: "Subsidio Único Familiar", description: "Transferencia monetaria para familias con hijos o hijas que cumplan requisitos de vulnerabilidad. Incluye montos por carga y por maternidad.", amount: 45000, deadline: "15 Abr 2025", status: "MISSING_DATA", category: "BONOS_Y_PENSIONES" },
  { id: "mock-3", title: "Bono por Asistencia Escolar", description: "Incentivo al estudio para estudiantes entre 6 y 18 años que mantengan asistencia escolar sobre 85%. Se paga dos veces al año.", amount: 21000, deadline: "30 Abr 2025", status: "ELIGIBLE", category: "JUVENTUD_Y_ESTUDIOS" },
  { id: "mock-4", title: "Subsidio de Arriendo", description: "Aporte mensual del Estado para ayudar a pagar el arriendo de la vivienda. Dirigido a familias del primer y segundo quintil que cumplan requisitos.", amount: 120000, deadline: "30 Jun 2025", status: "ELIGIBLE", category: "VIVIENDA" },
  { id: "mock-5", title: "Bono Marzo (Aporte Familiar)", description: "Monto de $61.793 por carga familiar o familiar a cargo. Se paga una vez al año en marzo a quienes cumplan los requisitos de elegibilidad.", amount: 61793, deadline: "31 Mar 2025", status: "ELIGIBLE", category: "BONOS_Y_PENSIONES" },
  { id: "mock-6", title: "Subsidio al Pago del Consumo de Agua Potable", description: "Ayuda para el pago del consumo de agua potable en sectores rurales o con alto costo. Hasta $25.000 según consumo y comuna.", amount: 25000, deadline: "15 Dic 2025", status: "MISSING_DATA", category: "VIVIENDA" },
  { id: "mock-7", title: "Fondo de Salud para Fonasa", description: "Acceso a prestaciones de salud para personas inscritas en Fonasa. Incluye consultas, exámenes y tratamientos según tramo.", amount: null, deadline: "31 Dic 2025", status: "ELIGIBLE", category: "SALUD_Y_CUIDADOS" },
  { id: "mock-8", title: "Capital Semilla Emprendimiento", description: "Financiamiento para iniciar o fortalecer un emprendimiento. Dirigido a personas que cumplan requisitos de fomento productivo.", amount: 500000, deadline: "30 Sep 2025", status: "MISSING_DATA", category: "EMPRENDIMIENTO" },
];

export default function BenefitsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<BenefitCategoryId>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const {
    data: matches,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useUserMatches();

  const mapped = mapMatchesToBenefitItems(matches);
  const allBenefits = USE_MOCK_FOR_TESTING
    ? MOCK_BENEFITS
    : isError
      ? []
      : mapped.length > 0
        ? mapped
        : [];

  const userId = useAuthStore((s) => s.userId);
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getProfile(userId).then((profile) => {
      const name = profile?.name?.trim();
      setProfileName(name && name.length > 0 ? name : null);
    });
  }, [userId]);

  const userInitial =
    profileName && profileName.length > 0
      ? profileName.charAt(0).toUpperCase()
      : null;

  const handleAction = async (
    benefitId: string,
    status: "APPLIED" | "DISMISSED"
  ) => {
    try {
      await apiClient.post(`/applications/${userId}/status`, {
        benefitId,
        status,
      });
    } catch (e) {
      if (__DEV__) console.warn("Error guardando estado:", e);
    }
  };

  const filteredBenefits = useMemo(() => {
    if (!allBenefits.length) return [];
    if (selectedCategory === "ALL") return allBenefits;
    return allBenefits.filter(
      (item) => normalizeCategoryForFilter(item.category) === selectedCategory
    );
  }, [allBenefits, selectedCategory]);

  const eligibleCount = filteredBenefits.filter(
    (b) => b.status === "ELIGIBLE"
  ).length;

  const isApiLoading = !USE_MOCK_FOR_TESTING && isLoading && !matches;
  const showErrorState = !USE_MOCK_FOR_TESTING && isError;

  /* ── Loading state ── */
  if (isApiLoading) {
    return (
      <View style={s.loadingWrap}>
        <Animated.View entering={FadeIn.duration(300)} style={s.loadingInner}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={s.loadingText}>Buscando beneficios...</Text>
        </Animated.View>
      </View>
    );
  }

  /* ── Empty / error component ── */
  const listEmptyComponent = showErrorState ? (
    <Animated.View entering={FadeInDown.duration(400)} style={s.emptyWrap}>
      <View style={s.emptyIconWrap}>
        <Text style={{ fontSize: 44 }}>📡</Text>
      </View>
      <Text style={s.emptyTitle}>Sin conexión</Text>
      <Text style={s.emptyDesc}>
        No pudimos cargar los beneficios. Tira hacia abajo para reintentar.
      </Text>
      <AnimatedPressableScale onPress={() => refetch()} style={s.emptyButton}>
        <Text style={s.emptyButtonText}>Reintentar</Text>
      </AnimatedPressableScale>
    </Animated.View>
  ) : (
    <Animated.View entering={FadeInDown.duration(400)} style={s.emptyWrap}>
      <View style={s.emptyIconWrap}>
        <Search size={36} color={theme.colors.textSecondary} strokeWidth={1.5} />
      </View>
      <Text style={s.emptyTitle}>Sin resultados</Text>
      <Text style={s.emptyDesc}>
        No encontramos beneficios en esta categoría para tu perfil.
      </Text>
      <AnimatedPressableScale
        onPress={() => setSelectedCategory("ALL")}
        style={s.emptyButton}
      >
        <Text style={s.emptyButtonText}>Ver todos</Text>
      </AnimatedPressableScale>
    </Animated.View>
  );

  return (
    <View style={s.screen}>
      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={s.backButton}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <ChevronLeft size={24} strokeWidth={2.2} color={theme.colors.text} />
          </Pressable>

          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Beneficios</Text>
            <Text style={s.headerSubtitle}>
              {filteredBenefits.length > 0
                ? `${filteredBenefits.length} resultado${filteredBenefits.length !== 1 ? "s" : ""}${eligibleCount > 0 ? ` \u00b7 ${eligibleCount} elegible${eligibleCount !== 1 ? "s" : ""}` : ""}`
                : "Para tu perfil"}
            </Text>
          </View>

          <View style={s.headerRight}>
            <Pressable
              onPress={() =>
                setViewMode(viewMode === "list" ? "grid" : "list")
              }
              style={s.iconButton}
              accessibilityRole="button"
              accessibilityLabel={
                viewMode === "list" ? "Ver en cuadrícula" : "Ver en lista"
              }
            >
              {viewMode === "list" ? (
                <LayoutGrid
                  size={20}
                  color={theme.colors.primary}
                  strokeWidth={2}
                />
              ) : (
                <List size={20} color={theme.colors.primary} strokeWidth={2} />
              )}
            </Pressable>
            <View style={s.avatar}>
              {userInitial ? (
                <Text style={s.avatarText}>{userInitial}</Text>
              ) : (
                <User size={18} color="#fff" strokeWidth={2.2} />
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ── Category pills ── */}
      <View style={s.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersScroll}
        >
          {BENEFIT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const IconComp = CATEGORY_ICONS[cat.iconKey] ?? Flame;
            return (
              <AnimatedPressableScale
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  s.pill,
                  isActive ? s.pillActive : s.pillInactive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filtrar por ${cat.label}`}
                accessibilityState={{ selected: isActive }}
              >
                <IconComp
                  size={16}
                  color={isActive ? "#fff" : theme.colors.textSecondary}
                  strokeWidth={2}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    s.pillText,
                    { color: isActive ? "#fff" : theme.colors.textSecondary },
                  ]}
                >
                  {cat.label}
                </Text>
              </AnimatedPressableScale>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Content ── */}
      <View style={s.content}>
        {viewMode === "grid" ? (
          <BenefitsGrid
            data={filteredBenefits}
            onPostular={(item) =>
              item.id && router.push(`/benefit/${item.id}` as const)
            }
            onAction={handleAction}
            onCompletarPerfil={() => router.push("/wizard")}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={listEmptyComponent}
          />
        ) : (
          <BenefitsFeed
            data={filteredBenefits}
            onPostular={(item) => {
              if (item.id) router.push(`/benefit/${item.id}` as const);
            }}
            onAction={handleAction}
            onCompletarPerfil={() => router.push("/wizard")}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  /* ── Header ── */
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  /* ── Filters ── */
  filtersWrap: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  pill: {
    height: 38,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 20,
    ...(Platform.OS === "ios" && { borderCurve: "continuous" as const }),
  },
  pillActive: {
    backgroundColor: theme.colors.primary,
    ...createShadow(3, theme.colors.primary),
  },
  pillInactive: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* ── Content ── */
  content: {
    flex: 1,
  },

  /* ── Loading ── */
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  loadingInner: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  /* ── Empty / Error ── */
  emptyWrap: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primaryTint,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
});
