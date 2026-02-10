import { BenefitsFeed } from "@/features/benefits/components/BenefitsFeed";
import type { BenefitItem } from "@/features/benefits/components/BenefitsFeed";
import { View, Text, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState, useMemo } from "react";
import { useUserMatches, mapMatchesToBenefitItems } from "@/features/benefits/api/useUserMatches";
import {
  BENEFIT_CATEGORIES,
  normalizeCategoryForFilter,
  type BenefitCategoryId,
} from "@/constants/categories";

/** Pon en true para probar la UI sin depender del API; false para usar datos reales */
const USE_MOCK_FOR_TESTING = true;

/** Mock con categorías alineadas al ENUM del backend para que los chips filtren bien */
const MOCK_BENEFITS: BenefitItem[] = [
  { id: "mock-1", title: "Bono al Trabajo de la Mujer", amount: 98750, deadline: "31 Mar 2025", status: "ELIGIBLE", category: "BONOS_ESTATALES" },
  { id: "mock-2", title: "Subsidio Único Familiar", amount: 45000, deadline: "15 Abr 2025", status: "MISSING_DATA", category: "BONOS_ESTATALES" },
  { id: "mock-3", title: "Bono por Asistencia Escolar", amount: 21000, deadline: "30 Abr 2025", status: "ELIGIBLE", category: "JUVENTUD_Y_ESTUDIOS" },
  { id: "mock-4", title: "Subsidio de Arriendo", amount: 120000, deadline: "30 Jun 2025", status: "ELIGIBLE", category: "VIVIENDA" },
  { id: "mock-5", title: "Bono Marzo (Aporte Familiar)", amount: 61793, deadline: "31 Mar 2025", status: "ELIGIBLE", category: "BONOS_ESTATALES" },
  { id: "mock-6", title: "Subsidio al Pago del Consumo de Agua Potable", amount: 25000, deadline: "15 Dic 2025", status: "MISSING_DATA", category: "VIVIENDA" },
  { id: "mock-7", title: "Fondo de Salud para Fonasa", amount: null, deadline: "31 Dic 2025", status: "ELIGIBLE", category: "SALUD_Y_CUIDADOS" },
  { id: "mock-8", title: "Capital Semilla Emprendimiento", amount: 500000, deadline: "30 Sep 2025", status: "MISSING_DATA", category: "EMPRENDIMIENTO" },
];

export default function BenefitsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategoryId>("ALL");
  const { data: matches, isLoading } = useUserMatches();
  const mapped = mapMatchesToBenefitItems(matches);
  const allBenefits = USE_MOCK_FOR_TESTING
    ? MOCK_BENEFITS
    : mapped.length > 0
      ? mapped
      : MOCK_BENEFITS;

  const filteredBenefits = useMemo(() => {
    if (!allBenefits.length) return [];
    if (selectedCategory === "ALL") return allBenefits;
    return allBenefits.filter(
      (item) => normalizeCategoryForFilter(item.category) === selectedCategory
    );
  }, [allBenefits, selectedCategory]);

  if (!USE_MOCK_FOR_TESTING && isLoading && !matches) {
    return (
      <View className="flex-1 items-center justify-center bg-teal-50">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-teal-50">
      {/* Header: grande, minimalista, back + avatar */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
        <Pressable onPress={() => router.back()} className="mr-3 -ml-1 p-1 active:opacity-70">
          <ChevronLeft size={28} strokeWidth={2} color="#0f766e" />
        </Pressable>
        <Text className="flex-1 text-3xl font-bold text-slate-800" numberOfLines={1}>
          Hola, Juan
        </Text>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-teal-600 shadow-sm">
          <Text className="text-base font-semibold text-white">J</Text>
        </View>
      </View>

      {/* Subtítulo en gris suave */}
      <View className="px-6 pb-3">
        <Text className="text-base text-slate-600">Tus beneficios disponibles</Text>
      </View>

      {/* Smart Chips: lista horizontal deslizante (estilo Netflix/YouTube) */}
      <View className="border-b border-teal-100 bg-white pb-4 shadow-sm">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingRight: 32,
            alignItems: "center",
            gap: 8,
          }}
          className="flex-row"
        >
          {BENEFIT_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={{ marginRight: 8 }}
                className={`min-w-0 flex-row items-center justify-center rounded-full border px-4 py-2.5 ${
                  isActive ? "border-teal-600 bg-teal-600" : "border-slate-200 bg-white"
                }`}
              >
                <Text
                  numberOfLines={1}
                  className={`font-bold ${isActive ? "text-white" : "text-slate-600"}`}
                >
                  {category.icon}  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-1">
        <BenefitsFeed
          data={filteredBenefits}
          onPostular={(item) => {
            if (item.id) router.push(`/benefit/${item.id}` as const);
          }}
          ListEmptyComponent={
            <View className="mt-10 items-center px-4">
              <Text className="text-4xl">🤷‍♂️</Text>
              <Text className="mt-2 text-center text-slate-500">
                No encontramos beneficios en esta categoría para tu perfil.
              </Text>
              <Pressable onPress={() => setSelectedCategory("ALL")} className="mt-4">
                <Text className="font-bold text-teal-600">Ver todos</Text>
              </Pressable>
            </View>
          }
        />
      </View>
    </View>
  );
}
