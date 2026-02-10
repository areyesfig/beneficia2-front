import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { ChevronLeft, Check, AlertTriangle, X } from "lucide-react-native";
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserMatches } from "@/features/benefits/api/useUserMatches";
import { openSafeUrl } from "@/utils/safe-open-url";

export default function BenefitDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title?: string;
    status?: string;
    deadline?: string;
    amount?: string;
    institution?: string;
  }>();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? undefined;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { data: matches, isLoading } = useUserMatches();
  const match =
    id && matches?.length
      ? matches.find((m) => String(m.benefit.id) === String(id)) ?? null
      : null;

  const fallbackTitle = typeof params.title === 'string' ? params.title : params.title?.[0];
  const fallbackStatus = typeof params.status === 'string' ? params.status : params.status?.[0];
  const fallbackDeadline = typeof params.deadline === 'string' ? params.deadline : params.deadline?.[0];
  const fallbackInstitution = typeof params.institution === 'string' ? params.institution : params.institution?.[0];

  const displayNameForHeader =
    match?.benefit.name ?? fallbackTitle ?? "Detalle";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <Pressable onPress={() => router.back()} className="mr-2 p-2 active:opacity-70">
          <ChevronLeft size={24} color="#0f766e" strokeWidth={2} />
        </Pressable>
      ),
      headerTitle: displayNameForHeader,
      headerTitleStyle: { fontWeight: "700", fontSize: 18 },
      headerStyle: { backgroundColor: "#f0fdfa" },
      headerShadowVisible: false,
    });
  }, [navigation, router, displayNameForHeader]);

  if (isLoading || !id) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (!match && !fallbackTitle) {
    return (
      <View className="flex-1 items-center justify-center bg-teal-50 px-6">
        <Text className="mb-4 text-center text-lg font-semibold text-slate-800">
          Beneficio no encontrado
        </Text>
        <Pressable onPress={() => router.back()} className="rounded-2xl bg-teal-600 px-6 py-3">
          <Text className="font-semibold text-white">Volver</Text>
        </Pressable>
      </View>
    );
  }

  const benefit = match?.benefit;
  const status = match?.status ?? (fallbackStatus as 'ELIGIBLE' | 'MISSING_DATA') ?? 'MISSING_DATA';
  const missingRequirements = match?.missingRequirements ?? [];
  const isEligible = status === "ELIGIBLE";

  const displayName = benefit?.name ?? fallbackTitle ?? 'Beneficio';
  const displayInstitution = benefit?.institution ?? fallbackInstitution;
  const displayDescription = benefit?.description ?? 'Sin descripción disponible.';
  const displayDeadline = benefit?.closesAt ?? fallbackDeadline ?? '--';

  const handlePrimaryAction = async () => {
    if (isEligible) {
      const urlToOpen = benefit?.urlApply?.trim() || "https://www.google.cl";
      const opened = await openSafeUrl(urlToOpen);
      if (!opened) {
        Alert.alert("Error", "No se pudo abrir el enlace de postulación.");
      }
    } else {
      router.push("/profile/rsh");
    }
  };

  return (
    <View className="flex-1 bg-teal-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 24 + 88,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de estado */}
        <View
          className={`mb-6 flex-row items-center gap-3 rounded-2xl p-4 ${
            isEligible ? "bg-teal-50" : "bg-amber-50"
          }`}
        >
          {isEligible ? (
            <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <Check size={20} color="#0d9488" strokeWidth={2.5} />
            </View>
          ) : (
            <View className="h-10 w-10 items-center justify-center rounded-full bg-amber-200">
              <AlertTriangle size={20} color="#d97706" strokeWidth={2} />
            </View>
          )}
          <Text
            className={`flex-1 text-base font-semibold ${
              isEligible ? "text-teal-800" : "text-amber-800"
            }`}
          >
            {isEligible ? "Eres elegible" : "Te falta información para postular"}
          </Text>
        </View>

        {/* Título grande */}
        <Text className="mb-3 text-2xl font-bold text-slate-800" numberOfLines={3}>
          {displayName}
        </Text>

        {/* Badge institución */}
        {displayInstitution ? (
          <View className="mb-5 self-start rounded-full bg-slate-200 px-3 py-1.5">
            <Text className="text-sm font-medium text-slate-600">{displayInstitution}</Text>
          </View>
        ) : null}

        {/* Descripción */}
        <View className="mb-8 rounded-3xl bg-white p-5 shadow-lg">
          <Text className="text-base leading-6 text-slate-700">
            {displayDescription}
          </Text>
        </View>

        {/* ¿Qué me falta? - solo si NO es eligible */}
        {!isEligible && missingRequirements.length > 0 && (
          <View className="mb-8 rounded-3xl bg-white p-5 shadow-lg">
            <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              ¿Qué me falta?
            </Text>
            <View className="gap-3">
              {missingRequirements.map((req, index) => (
                <View key={`${req}-${index}`} className="flex-row items-center gap-3">
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-red-100">
                    <X size={14} color="#dc2626" strokeWidth={2.5} />
                  </View>
                  <Text className="flex-1 text-base text-slate-700">{req}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Footer */}
      <View
        className="absolute left-0 right-0 border-t border-teal-100 bg-teal-50 px-6 pb-6 pt-4"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <Pressable
          onPress={handlePrimaryAction}
          className="rounded-2xl bg-teal-600 py-4 active:opacity-90"
          style={{ alignItems: "center" }}
        >
          <Text className="font-semibold text-white">
            {isEligible ? "Ir a Postular" : "Actualizar mis datos"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
