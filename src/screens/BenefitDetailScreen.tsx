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
import { cardStyle, buttonStyle } from "@/styles/screenStyles";
import { openSafeUrl } from "@/utils/safe-open-url";
import { theme } from "@/theme/theme";
import { VStack, HStack } from "@/theme/layout";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";

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
        <Pressable onPress={() => router.back()} style={{ marginRight: theme.spacing.sm, padding: theme.spacing.sm }}>
          <ChevronLeft size={24} color={theme.colors.primaryDark} strokeWidth={2} />
        </Pressable>
      ),
      headerTitle: displayNameForHeader,
      headerTitleStyle: { fontWeight: "700", fontSize: 18 },
      headerStyle: { backgroundColor: theme.colors.background },
      headerShadowVisible: false,
    });
  }, [navigation, router, displayNameForHeader]);

  if (isLoading || !id) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!match && !fallbackTitle) {
    return (
      <VStack spacing={theme.spacing.md} style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.lg }}>
        <Text style={[theme.typography.h3, { color: theme.colors.text, textAlign: "center", marginBottom: theme.spacing.md }]}>
          Beneficio no encontrado
        </Text>
        <AnimatedPressableScale onPress={() => router.back()} style={[{ paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.primary }, buttonStyle.rounded]}>
          <Text style={[theme.typography.label, { color: "#fff" }]}>Volver</Text>
        </AnimatedPressableScale>
      </VStack>
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.lg + 88,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HStack
          spacing={12}
          style={[
            {
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: isEligible ? theme.colors.successTint : theme.colors.warningTint,
            },
            cardStyle.wrapper,
            cardStyle.shadow,
          ]}
        >
          {isEligible ? (
            <View
              style={[
                { width: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.successTint },
                cardStyle.wrapper,
              ]}
            >
              <Check size={24} color={theme.colors.success} strokeWidth={2.5} />
            </View>
          ) : (
            <View
              style={[
                { width: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.warningTint },
                cardStyle.wrapper,
              ]}
            >
              <AlertTriangle size={24} color={theme.colors.warning} strokeWidth={2} />
            </View>
          )}
          <Text
            style={[
              theme.typography.body,
              { fontWeight: "600", flex: 1, color: isEligible ? theme.colors.successText : theme.colors.warningText },
            ]}
          >
            {isEligible ? "Eres elegible" : "Te falta información para postular"}
          </Text>
        </HStack>

        <Text style={[theme.typography.h2, { color: theme.colors.text, marginBottom: theme.spacing.sm }]} numberOfLines={3}>
          {displayName}
        </Text>

        {displayInstitution ? (
          <View
            style={[
              { marginBottom: theme.spacing.lg, alignSelf: "flex-start", paddingHorizontal: theme.spacing.sm, paddingVertical: 6, backgroundColor: theme.colors.border },
              cardStyle.wrapper,
            ]}
          >
            <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>{displayInstitution}</Text>
          </View>
        ) : null}

        <View style={[{ marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }, cardStyle.wrapper, cardStyle.shadow]}>
          <Text style={[theme.typography.body, { color: theme.colors.text, lineHeight: 24 }]}>
            {displayDescription}
          </Text>
        </View>

        {!isEligible && missingRequirements.length > 0 && (
          <View style={[{ marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }, cardStyle.wrapper, cardStyle.shadow]}>
            <Text style={[theme.typography.caption, { fontWeight: "700", marginBottom: theme.spacing.md, color: theme.colors.textSecondary, letterSpacing: 0.5 }]}>
              ¿Qué me falta?
            </Text>
            <VStack spacing={12}>
              {missingRequirements.map((req, index) => (
                <HStack key={`${req}-${index}`} spacing={theme.spacing.sm}>
                  <View
                    style={[
                      { width: 24, height: 24, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.errorTint },
                      cardStyle.wrapper,
                    ]}
                  >
                    <X size={14} color={theme.colors.error} strokeWidth={2.5} />
                  </View>
                  <Text style={[theme.typography.body, { flex: 1, color: theme.colors.text }]}>{req}</Text>
                </HStack>
              ))}
            </VStack>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: "rgba(255,255,255,0.95)",
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.lg,
        }}
      >
        <AnimatedPressableScale
          onPress={handlePrimaryAction}
          style={[
            { paddingVertical: theme.spacing.md, alignItems: "center" },
            buttonStyle.rounded,
            buttonStyle.shadowPrimary,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text style={[theme.typography.label, { color: "#fff" }]}>
            {isEligible ? "Ir a Postular" : "Actualizar mis datos"}
          </Text>
        </AnimatedPressableScale>
      </View>
    </View>
  );
}
