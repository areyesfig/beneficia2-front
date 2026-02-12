import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { API_URL } from "@/config/api";
import { getCurrentUserId, ANONYMOUS_DEV_USER_ID } from "@/config/env";
import { validateRut, formatRutInput } from "@/utils/rut-validator";
import { theme } from "@/theme/theme";
import { buttonStyle } from "@/styles/screenStyles";

const TRAMOS_RSH = [40, 50, 60, 70, 80, 90, 100] as const;
const MIN_CARGAS = 0;
const MAX_CARGAS = 20;

const profileSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  age: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !Number.isNaN(val) && val > 0 && val < 120, "Edad inválida"),
  rut: z
    .string()
    .min(8, "Ingresa un RUT")
    .refine((val) => validateRut(val), "RUT chileno inválido"),
  rsh: z
    .number()
    .refine((n) => TRAMOS_RSH.includes(n as (typeof TRAMOS_RSH)[number]), "Selecciona un tramo"),
  cargasFamiliares: z
    .number()
    .min(MIN_CARGAS, `Mínimo ${MIN_CARGAS}`)
    .max(MAX_CARGAS, `Máximo ${MAX_CARGAS}`),
  income: z
    .string()
    .transform((val) => parseInt(val, 10) || 0)
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const TOTAL_STEPS = 6;

export default function WizardScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: undefined as unknown as string,
      rut: "",
      rsh: 40,
      cargasFamiliares: 0,
      income: undefined as unknown as string,
    },
    mode: "onBlur",
  });

  const currentRsh = watch("rsh");

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const birthYear = new Date().getFullYear() - (typeof data.age === "number" ? data.age : 0);
      const birthDate = `${birthYear}-01-01T00:00:00.000Z`;

      const payload = {
        name: data.name,
        birthDate,
        rshPercentage: data.rsh ?? 40,
        income: typeof data.income === "number" ? data.income : 0,
        // Si el backend acepta rut y cargas en el futuro, descomenta:
        // rut: data.rut,
        // cargasFamiliares: data.cargasFamiliares,
      };

      const userId = getCurrentUserId() ?? ANONYMOUS_DEV_USER_ID;
      const response = await fetch(`${API_URL}/profile/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("¡Perfil creado!", "Ahora buscaremos tus beneficios.", [
          { text: "OK", onPress: () => router.replace("/home") },
        ]);
      } else {
        Alert.alert("Error", "No se pudo guardar el perfil.");
      }
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }
      Alert.alert("Error", "Error de conexión.");
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const ok = await trigger("name");
      if (ok) setStep(2);
    } else if (step === 2) {
      const ok = await trigger("age");
      if (ok) setStep(3);
    } else if (step === 3) {
      const ok = await trigger("rut");
      if (ok) setStep(4);
    } else if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>¡Hola! 👋</Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Para encontrar tus bonos, necesito conocerte un poco. ¿Cómo te llamas?
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    theme.typography.body,
                    { fontSize: 20, width: "100%", borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: theme.spacing.md, color: theme.colors.text },
                    buttonStyle.rounded,
                  ]}
                  placeholder="Tu nombre"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.name && (
              <Text style={[theme.typography.bodySmall, { color: theme.colors.error }]}>{errors.name.message}</Text>
            )}
          </View>
        );

      case 2:
        return (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>¿Qué edad tienes?</Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Muchos beneficios dependen de tu etapa de vida.
            </Text>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    theme.typography.body,
                    { fontSize: 20, width: "100%", borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: theme.spacing.md, color: theme.colors.text },
                    buttonStyle.rounded,
                  ]}
                  placeholder="Ej: 28"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  value={value?.toString() ?? ""}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.age && (
              <Text style={[theme.typography.bodySmall, { color: theme.colors.error }]}>{errors.age.message}</Text>
            )}
          </View>
        );

      case 3:
        return (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>RUT del titular</Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Ingresa el RUT de quien postula al Registro Social de Hogares.
            </Text>
            <Controller
              control={control}
              name="rut"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    style={[
                      theme.typography.body,
                      { fontSize: 18, width: "100%", borderRadius: theme.borderRadius.lg, borderWidth: 1, backgroundColor: theme.colors.surface, padding: theme.spacing.md, color: theme.colors.text, borderColor: errors.rut ? theme.colors.error : theme.colors.border },
                      buttonStyle.rounded,
                    ]}
                    placeholder="12.345.678-9"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={value}
                    onChangeText={(text) => onChange(formatRutInput(text))}
                    onBlur={onBlur}
                    keyboardType="numbers-and-punctuation"
                    autoCapitalize="characters"
                    maxLength={12}
                  />
                  {errors.rut && (
                    <Text style={[theme.typography.bodySmall, { color: theme.colors.error, marginTop: 6 }]}>{errors.rut.message}</Text>
                  )}
                </View>
              )}
            />
          </View>
        );

      case 4:
        return (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
              Registro Social de Hogares
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              ¿En qué tramo estás? Si no sabes, marca 100%.
            </Text>
            <View style={{ marginTop: theme.spacing.md, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: theme.spacing.sm }}>
              {TRAMOS_RSH.map((percent) => {
                const isSelected = currentRsh === percent;
                return (
                  <TouchableOpacity
                    key={percent}
                    onPress={() => setValue("rsh", percent)}
                    style={[
                      { width: "48%", borderRadius: theme.borderRadius.lg, borderWidth: 2, padding: theme.spacing.md },
                      buttonStyle.rounded,
                      isSelected ? { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary } : { borderColor: theme.colors.primaryTint, backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Text
                      style={[
                        theme.typography.body,
                        { fontSize: 18, fontWeight: "700", textAlign: "center", color: isSelected ? "#fff" : theme.colors.textSecondary },
                      ]}
                    >
                      {percent}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Cargas familiares</Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Número de personas que dependen económicamente de ti (hijos, cónyuge, etc.).
            </Text>
            <Controller
              control={control}
              name="cargasFamiliares"
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.lg, paddingVertical: theme.spacing.lg }}>
                  <Pressable
                    onPress={() => onChange(Math.max(MIN_CARGAS, value - 1))}
                    disabled={value <= MIN_CARGAS}
                    style={[
                      { width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: theme.borderRadius.full },
                      value <= MIN_CARGAS ? { backgroundColor: theme.colors.primaryTint } : { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text style={[theme.typography.h2, { fontWeight: "700", color: value <= MIN_CARGAS ? theme.colors.textSecondary : "#fff" }]}>−</Text>
                  </Pressable>
                  <Text style={[theme.typography.h1, { minWidth: 48, textAlign: "center", color: theme.colors.text }]}>
                    {value}
                  </Text>
                  <Pressable
                    onPress={() => onChange(Math.min(MAX_CARGAS, value + 1))}
                    disabled={value >= MAX_CARGAS}
                    style={[
                      { width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: theme.borderRadius.full },
                      value >= MAX_CARGAS ? { backgroundColor: theme.colors.primaryTint } : { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text style={[theme.typography.h2, { fontWeight: "700", color: value >= MAX_CARGAS ? theme.colors.textSecondary : "#fff" }]}>+</Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        );

      case 6:
        return (
          <View style={{ gap: theme.spacing.md }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
              Ingresos mensuales
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Aproximado del hogar (pon 0 si no tienes).
            </Text>
            <Controller
              control={control}
              name="income"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    theme.typography.body,
                    { fontSize: 20, width: "100%", borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: theme.spacing.md, color: theme.colors.text },
                    buttonStyle.rounded,
                  ]}
                  placeholder="$ 0"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  value={value?.toString() ?? ""}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, padding: theme.spacing.lg }}>
          {/* Omitir y ir al inicio */}
          <View style={{ marginBottom: theme.spacing.md, flexDirection: "row", justifyContent: "flex-end" }}>
            <Link href="/home" asChild>
              <TouchableOpacity>
                <Text style={[theme.typography.label, { color: theme.colors.primary }]}>Omitir</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Barra de progreso */}
          <View style={{ marginBottom: theme.spacing.xl, height: 8, overflow: "hidden", borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.primaryTint }}>
            <View
              style={{ height: "100%", borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.primary, width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </View>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderStep()}
          </ScrollView>

          {/* Botones de navegación */}
          <View style={{ marginTop: "auto", flexDirection: "row", justifyContent: "space-between", gap: theme.spacing.sm, paddingTop: theme.spacing.lg }}>
            <TouchableOpacity
              onPress={prevStep}
              disabled={step === 1}
              style={[
                { width: "45%", borderRadius: theme.borderRadius.lg, padding: theme.spacing.md },
                buttonStyle.rounded,
                step === 1 ? { opacity: 0 } : { backgroundColor: theme.colors.border },
              ]}
            >
              <Text style={[theme.typography.label, { textAlign: "center", color: theme.colors.textSecondary }]}>Atrás</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextStep}
              style={[
                { width: "45%", borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, backgroundColor: theme.colors.primary },
                buttonStyle.rounded,
                buttonStyle.shadowPrimary,
              ]}
            >
              <Text style={[theme.typography.label, { textAlign: "center", fontWeight: "700", color: "#fff" }]}>
                {step === TOTAL_STEPS ? "Finalizar" : "Siguiente"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
