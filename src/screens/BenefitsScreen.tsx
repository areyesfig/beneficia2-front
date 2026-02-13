import { BenefitsFeed } from "@/features/benefits/components/BenefitsFeed";
import type { BenefitItem } from "@/features/benefits/components/BenefitsFeed";
import { View, Text, ActivityIndicator, Pressable, ScrollView, RefreshControl } from "react-native";
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
  type LucideIcon,
} from "lucide-react-native";
import { useState, useMemo, useEffect } from "react";
import { useUserMatches, mapMatchesToBenefitItems } from "@/features/benefits/api/useUserMatches";
import { getProfile } from "@/features/profile/api/profileApi";
import {
  BENEFIT_CATEGORIES,
  normalizeCategoryForFilter,
  type BenefitCategoryId,
} from "@/constants/categories";
import { API_URL } from "@/config/api";
import { getCurrentUserId, ANONYMOUS_DEV_USER_ID } from "@/config/env";
import { chipStyle } from "@/styles/screenStyles";
import { theme } from "@/theme/theme";
import { VStack, HStack } from "@/theme/layout";
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

/** En true muestra 8 beneficios de prueba; en false usa los del API (GET /benefits/:userId/match). */
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
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategoryId>("ALL");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const { data: matches, isLoading, isError, refetch, isRefetching } = useUserMatches();
  const mapped = mapMatchesToBenefitItems(matches);
  const allBenefits = USE_MOCK_FOR_TESTING
    ? MOCK_BENEFITS
    : isError
      ? []
      : mapped.length > 0
        ? mapped
        : [];

  const userId = getCurrentUserId() ?? ANONYMOUS_DEV_USER_ID;
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getProfile(userId).then((profile) => {
      const name = profile?.name?.trim();
      setProfileName(name && name.length > 0 ? name : null);
    });
  }, [userId]);

  const userInitial = profileName && profileName.length > 0
    ? profileName.charAt(0).toUpperCase()
    : "J";

  const handleAction = async (benefitId: string, status: "APPLIED" | "DISMISSED") => {
    try {
      await fetch(`${API_URL}/applications/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ benefitId, status }),
      });
    } catch (e) {
      if (__DEV__) console.warn("Error guardando estado de postulación:", e);
    }
  };

  const filteredBenefits = useMemo(() => {
    if (!allBenefits.length) return [];
    if (selectedCategory === "ALL") return allBenefits;
    return allBenefits.filter(
      (item) => normalizeCategoryForFilter(item.category) === selectedCategory
    );
  }, [allBenefits, selectedCategory]);

  const isApiLoading = !USE_MOCK_FOR_TESTING && isLoading && !matches;
  const showErrorState = !USE_MOCK_FOR_TESTING && isError;

  const listEmptyComponent = showErrorState ? (
    <VStack spacing={theme.spacing.md} style={{ marginTop: theme.spacing.xl, alignItems: "center", paddingHorizontal: theme.spacing.lg, flex: 1 }}>
      <Text style={{ fontSize: 48 }}>📡</Text>
      <Text style={[theme.typography.body, { textAlign: "center", color: theme.colors.textSecondary }]}>
        No pudimos cargar los beneficios. Tira para reintentar.
      </Text>
      <AnimatedPressableScale onPress={() => refetch()} style={{ marginTop: theme.spacing.md }}>
        <Text style={[theme.typography.label, { fontWeight: "700", color: theme.colors.primary }]}>Reintentar</Text>
      </AnimatedPressableScale>
    </VStack>
  ) : (
    <VStack spacing={theme.spacing.md} style={{ marginTop: theme.spacing.xl, alignItems: "center", paddingHorizontal: theme.spacing.md }}>
      <Text style={{ fontSize: 48 }}>🤷‍♂️</Text>
      <Text style={[theme.typography.body, { textAlign: "center", color: theme.colors.textSecondary }]}>
        No encontramos beneficios en esta categoría para tu perfil.
      </Text>
      <AnimatedPressableScale onPress={() => setSelectedCategory("ALL")} style={{ marginTop: theme.spacing.md }}>
        <Text style={[theme.typography.label, { fontWeight: "700", color: theme.colors.primary }]}>Ver todos</Text>
      </AnimatedPressableScale>
    </VStack>
  );

  if (isApiLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <VStack spacing={4} style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg }}>
        <HStack spacing={theme.spacing.sm} style={{ justifyContent: "space-between" }}>
          <Pressable onPress={() => router.back()} style={{ marginLeft: -theme.spacing.xs, padding: theme.spacing.sm }}>
            <ChevronLeft size={26} strokeWidth={2} color={theme.colors.primaryDark} />
          </Pressable>
          <Text style={[theme.typography.h3, { color: theme.colors.text }]} numberOfLines={1}>
            Beneficios
          </Text>
          <HStack spacing={theme.spacing.xs}>
            <Pressable
              onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              style={[
                { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
                chipStyle.rounded,
              ]}
              accessibilityRole="button"
              accessibilityLabel={viewMode === "list" ? "Ver en cuadrícula" : "Ver en lista"}
            >
              {viewMode === "list" ? (
                <LayoutGrid size={22} color={theme.colors.primary} strokeWidth={2} />
              ) : (
                <List size={22} color={theme.colors.primary} strokeWidth={2} />
              )}
            </Pressable>
            <View
              style={[
                { width: 40, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.primary },
                chipStyle.rounded,
              ]}
            >
              <Text style={[theme.typography.label, { fontWeight: "700", color: "#fff" }]}>{userInitial}</Text>
            </View>
          </HStack>
        </HStack>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, paddingHorizontal: theme.spacing.xs }]}>
          Para tu perfil
        </Text>
      </VStack>

      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.md }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            paddingRight: theme.spacing.xl,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            minHeight: 44,
          }}
        >
          {BENEFIT_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            const IconComponent = CATEGORY_ICONS[category.iconKey] ?? Flame;
            return (
              <AnimatedPressableScale
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  {
                    height: 44,
                    minWidth: 80,
                    paddingHorizontal: theme.spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.background,
                  },
                  chipStyle.rounded,
                  isActive && chipStyle.shadow,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filtrar por ${category.label}`}
                accessibilityState={{ selected: isActive }}
              >
                <IconComponent size={18} color={isActive ? "#fff" : theme.colors.textSecondary} strokeWidth={2} />
                <Text
                  numberOfLines={1}
                  style={[
                    theme.typography.label,
                    { color: isActive ? "#fff" : theme.colors.textSecondary },
                  ]}
                >
                  {category.label}
                </Text>
              </AnimatedPressableScale>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        {viewMode === "grid" ? (
          <BenefitsGrid
            data={filteredBenefits}
            onPostular={(item) => item.id && router.push(`/benefit/${item.id}` as const)}
            onAction={handleAction}
            onCompletarPerfil={() => router.push('/wizard')}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
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
          onCompletarPerfil={() => router.push('/wizard')}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
          }
          ListEmptyComponent={listEmptyComponent}
        />
        )}
      </View>

    </View>
  );
}
