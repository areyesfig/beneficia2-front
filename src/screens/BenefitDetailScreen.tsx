import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { ChevronLeft, Check, AlertTriangle, X, CheckCircle2, CircleAlert, Calendar } from "lucide-react-native";
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
import { useUserMatches, type MissingReqItem } from "@/features/benefits/api/useUserMatches";
import { cardStyle, buttonStyle } from "@/styles/screenStyles";
import { openSafeUrl } from "@/utils/safe-open-url";
import { theme } from "@/theme/theme";
import { VStack, HStack } from "@/theme/layout";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";

export default function BenefitDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title?: string;
    description?: string;
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
  const fallbackDescription = typeof params.description === 'string' ? params.description : params.description?.[0];
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

  // Mostrar loader solo cuando no tenemos nada que mostrar (ej. deep link sin params). Si venimos de la lista, ya tenemos title/description en params → pintar el detalle al instante.
  const canShowFromParams = !!(fallbackTitle ?? fallbackDescription);
  const hasNoDataYet = !matches && isLoading && !canShowFromParams;
  if (hasNoDataYet || !id) {
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
  const status = (match?.match?.status ?? match?.status ?? fallbackStatus) as string;
  const isEligible = status === "ELIGIBLE";
  const explanation = match?.match?.explanation;
  const missingReqs = match?.match?.missingReqs ?? [];
  const missingRequirements = match?.missingRequirements ?? [];

  const displayName = benefit?.name ?? fallbackTitle ?? 'Beneficio';
  const displayInstitution = benefit?.institution ?? fallbackInstitution;
  const displayDescription = benefit?.description ?? fallbackDescription ?? 'Sin descripción disponible.';

  const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return '--';
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '--';
      return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };
  const opensAtFormatted = formatDate(benefit?.opensAt);
  const closesAtFormatted = benefit?.closesAt != null ? formatDate(benefit.closesAt) : (fallbackDeadline ?? '--');
  const hasDates = opensAtFormatted !== '--' || closesAtFormatted !== '--';

  const now = new Date();
  const opensAtDate = benefit?.opensAt ? new Date(benefit.opensAt) : null;
  const closesAtDate = benefit?.closesAt ? new Date(benefit.closesAt) : null;
  let applicationOpen: boolean | null = null;
  if (opensAtDate ?? closesAtDate) {
    if (opensAtDate && closesAtDate) {
      applicationOpen = now >= opensAtDate && now <= closesAtDate;
    } else if (closesAtDate) {
      applicationOpen = now <= closesAtDate;
    } else {
      applicationOpen = now >= opensAtDate!;
    }
  }
  const applicationStatusLabel =
    applicationOpen === true ? 'Postulación abierta' : applicationOpen === false ? 'Postulación cerrada' : null;

  const hasUrlApply = (benefit?.urlApply ?? '').trim().length > 0;

  // Detectar si un beneficio tiene "sin reglas definidas"
  const hasNoRulesDefined = () => {
    if (!match) return false;

    // Opción 1: Verificar missingReqs
    const hasNoRulesInReqs = missingReqs.some(
      (req) => req.key === 'requirements' && req.label === 'Sin reglas definidas'
    );

    // Opción 2: Verificar explanation.missingFacts
    const hasNoRulesInFacts = explanation?.missingFacts?.some(
      (fact) => fact.key === 'requirements' && fact.label === 'Sin reglas definidas'
    );

    // Opción 3: Verificar explanation.notes
    const hasNoRulesInNotes = explanation?.notes?.includes('Sin reglas definidas');

    return hasNoRulesInReqs || hasNoRulesInFacts || hasNoRulesInNotes;
  };

  const isPostulable = match != null ? (benefit?.requiresApplication ?? true) && !hasNoRulesDefined() : true;

  const handlePrimaryAction = async () => {
    if (!isPostulable) {
      // Para beneficios no postulables, si hay URL, abrirla; si no, cerrar
      const urlToOpen = benefit?.urlApply?.trim() || "";
      if (urlToOpen) {
        await openSafeUrl(urlToOpen);
      } else {
        router.back();
      }
      return;
    }
    if (isEligible) {
      const urlToOpen = benefit?.urlApply?.trim() || "";
      const opened = await openSafeUrl(urlToOpen);
      if (!opened) {
        Alert.alert("Error", "No se pudo abrir el enlace de postulación.");
      }
    } else {
      router.push("/wizard");
    }
  };

  const primaryButtonLabel = !isPostulable
    ? "Ver más información"
    : isEligible
      ? "Ver más información"
      : "Actualizar mis datos";

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

        {!isPostulable ? (
          <View style={[{ marginBottom: theme.spacing.lg, backgroundColor: theme.colors.surface, padding: theme.spacing.xl, borderWidth: 1, borderColor: theme.colors.border }, cardStyle.wrapper, cardStyle.shadow]}>
            <VStack spacing={theme.spacing.md} style={{ alignItems: "center" }}>
              <View style={[{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.primaryTint }]}>
                <Check size={28} color={theme.colors.primaryDark} strokeWidth={2.5} />
              </View>
              <Text style={[theme.typography.h3, { color: theme.colors.text, textAlign: "center" }]}>
                Este programa no es postulable
              </Text>
              <Text style={[theme.typography.body, { color: theme.colors.textSecondary, textAlign: "center", lineHeight: 24 }]}>
                {benefit?.noApplicationMessage ?? 'Se asigna o entrega directamente según tu situación y los registros del Estado, sin trámite de postulación.'}
              </Text>
            </VStack>
          </View>
        ) : null}

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

        {hasDates ? (
          <View style={[{ marginBottom: theme.spacing.lg, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }, cardStyle.wrapper, cardStyle.shadow]}>
            <HStack spacing={theme.spacing.sm} style={{ marginBottom: theme.spacing.sm, alignItems: "center" }}>
              <Calendar size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[theme.typography.h3, { color: theme.colors.text }]}>Fechas de postulación</Text>
            </HStack>
            <VStack spacing={theme.spacing.xs}>
              {applicationStatusLabel != null && (
                <View
                  style={[
                    {
                      alignSelf: 'flex-start',
                      paddingHorizontal: theme.spacing.sm,
                      paddingVertical: 6,
                      backgroundColor: applicationOpen ? theme.colors.successTint : theme.colors.warningTint,
                      marginBottom: theme.spacing.xs,
                    },
                    cardStyle.wrapper,
                  ]}
                >
                  <Text
                    style={[
                      theme.typography.label,
                      { color: applicationOpen ? theme.colors.successText : theme.colors.warningText, fontWeight: '600' },
                    ]}
                  >
                    {applicationStatusLabel}
                  </Text>
                </View>
              )}
              {opensAtFormatted !== '--' && (
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
                  Inicio: {opensAtFormatted}
                </Text>
              )}
              {closesAtFormatted !== '--' && (
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
                  Cierre: {closesAtFormatted}
                </Text>
              )}
            </VStack>
          </View>
        ) : null}

        <View style={[{ marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }, cardStyle.wrapper, cardStyle.shadow]}>
          <Text style={[theme.typography.body, { color: theme.colors.text, lineHeight: 24 }]}>
            {displayDescription}
          </Text>
        </View>

        {isPostulable && ((explanation?.eligibleFacts?.length ?? 0) > 0 || (explanation?.missingFacts?.length ?? 0) > 0) ? (
          <View style={[{ marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }, cardStyle.wrapper, cardStyle.shadow]}>
            <Text style={[theme.typography.h3, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
              Por qué te aparece
            </Text>
            {(explanation?.eligibleFacts?.length ?? 0) > 0 && (
              <VStack spacing={theme.spacing.sm} style={{ marginBottom: theme.spacing.md }}>
                {explanation?.eligibleFacts?.map((f: { key: string; label: string; value: unknown }, i: number) => (
                  <HStack key={`ef-${f.key}-${i}`} spacing={theme.spacing.sm}>
                    <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />
                    <Text style={[theme.typography.body, { flex: 1, color: theme.colors.text }]}>
                      {f.label}: {String(f.value)}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
            {(explanation?.missingFacts?.length ?? 0) > 0 && (
              <VStack spacing={theme.spacing.sm}>
                {explanation?.missingFacts?.map((f: { key: string; label: string; needed?: unknown }, i: number) => (
                  <HStack key={`mf-${f.key}-${i}`} spacing={theme.spacing.sm}>
                    <CircleAlert size={20} color={theme.colors.warning} strokeWidth={2} />
                    <Text style={[theme.typography.body, { flex: 1, color: theme.colors.text }]}>
                      {f.label}{f.needed != null ? ` (${String(f.needed)})` : ''}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </View>
        ) : null}

        {isPostulable && missingReqs.length > 0 ? (
          <View style={[{ marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }, cardStyle.wrapper, cardStyle.shadow]}>
            <Text style={[theme.typography.h3, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
              Qué hacer
            </Text>
            <VStack spacing={theme.spacing.sm}>
              {missingReqs.map((req: MissingReqItem, index: number) => (
                <Pressable
                  key={`${req.key}-${index}`}
                  onPress={() => {
                    if (req.actionUrl) openSafeUrl(req.actionUrl!);
                    else router.push("/wizard");
                  }}
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: theme.spacing.sm,
                      paddingHorizontal: theme.spacing.sm,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.background,
                    },
                    cardStyle.wrapper,
                  ]}
                >
                  <View style={[{ width: 24, height: 24, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.warningTint }, cardStyle.wrapper]}>
                    <X size={14} color={theme.colors.warning} strokeWidth={2} />
                  </View>
                  <Text style={[theme.typography.body, { flex: 1, color: theme.colors.text, marginLeft: theme.spacing.sm }]}>{req.label}</Text>
                  <Text style={[theme.typography.label, { color: theme.colors.primary }]}>
                    {req.actionLabel ?? "Completar perfil"}
                  </Text>
                </Pressable>
              ))}
            </VStack>
          </View>
        ) : isPostulable && !isEligible && missingRequirements.length > 0 ? (
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
        ) : null}
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
            {primaryButtonLabel}
          </Text>
        </AnimatedPressableScale>
      </View>
    </View>
  );
}
