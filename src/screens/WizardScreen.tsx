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
          <View className="gap-4">
            <Text className="text-2xl font-bold text-slate-800">¡Hola! 👋</Text>
            <Text className="text-lg text-slate-600">
              Para encontrar tus bonos, necesito conocerte un poco. ¿Cómo te llamas?
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="w-full rounded-2xl border border-teal-200 bg-white p-4 text-xl text-slate-800"
                  placeholder="Tu nombre"
                  placeholderTextColor="#94a3b8"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500">{errors.name.message}</Text>
            )}
          </View>
        );

      case 2:
        return (
          <View className="gap-4">
            <Text className="text-2xl font-bold text-slate-800">¿Qué edad tienes?</Text>
            <Text className="text-slate-600">
              Muchos beneficios dependen de tu etapa de vida.
            </Text>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="w-full rounded-2xl border border-teal-200 bg-white p-4 text-xl text-slate-800"
                  placeholder="Ej: 28"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={value?.toString() ?? ""}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.age && (
              <Text className="text-red-500">{errors.age.message}</Text>
            )}
          </View>
        );

      case 3:
        return (
          <View className="gap-4">
            <Text className="text-2xl font-bold text-slate-800">RUT del titular</Text>
            <Text className="text-slate-600">
              Ingresa el RUT de quien postula al Registro Social de Hogares.
            </Text>
            <Controller
              control={control}
              name="rut"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    className={`w-full rounded-2xl border bg-white p-4 text-lg text-slate-800 ${
                      errors.rut ? "border-red-500" : "border-teal-200"
                    }`}
                    placeholder="12.345.678-9"
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onChangeText={(text) => onChange(formatRutInput(text))}
                    onBlur={onBlur}
                    keyboardType="numbers-and-punctuation"
                    autoCapitalize="characters"
                    maxLength={12}
                  />
                  {errors.rut && (
                    <Text className="mt-1.5 text-red-500">{errors.rut.message}</Text>
                  )}
                </View>
              )}
            />
          </View>
        );

      case 4:
        return (
          <View className="gap-4">
            <Text className="text-2xl font-bold text-slate-800">
              Registro Social de Hogares
            </Text>
            <Text className="text-slate-600">
              ¿En qué tramo estás? Si no sabes, marca 100%.
            </Text>
            <View className="mt-4 flex-row flex-wrap justify-between gap-3">
              {TRAMOS_RSH.map((percent) => (
                <TouchableOpacity
                  key={percent}
                  onPress={() => setValue("rsh", percent)}
                  className={`w-[48%] rounded-2xl border-2 p-4 ${
                    currentRsh === percent
                      ? "border-teal-600 bg-teal-600"
                      : "border-teal-100 bg-white"
                  }`}
                >
                  <Text
                    className={`text-center text-lg font-bold ${
                      currentRsh === percent ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {percent}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View className="gap-4">
            <Text className="text-2xl font-bold text-slate-800">Cargas familiares</Text>
            <Text className="text-slate-600">
              Número de personas que dependen económicamente de ti (hijos, cónyuge, etc.).
            </Text>
            <Controller
              control={control}
              name="cargasFamiliares"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center justify-center gap-6 py-6">
                  <Pressable
                    onPress={() => onChange(Math.max(MIN_CARGAS, value - 1))}
                    disabled={value <= MIN_CARGAS}
                    className={`h-14 w-14 items-center justify-center rounded-full ${
                      value <= MIN_CARGAS ? "bg-teal-100" : "bg-teal-600"
                    }`}
                  >
                    <Text
                      className={`text-2xl font-bold ${
                        value <= MIN_CARGAS ? "text-teal-400" : "text-white"
                      }`}
                    >
                      −
                    </Text>
                  </Pressable>
                  <Text className="min-w-[3rem] text-center text-3xl font-bold text-slate-800">
                    {value}
                  </Text>
                  <Pressable
                    onPress={() => onChange(Math.min(MAX_CARGAS, value + 1))}
                    disabled={value >= MAX_CARGAS}
                    className={`h-14 w-14 items-center justify-center rounded-full ${
                      value >= MAX_CARGAS ? "bg-teal-100" : "bg-teal-600"
                    }`}
                  >
                    <Text
                      className={`text-2xl font-bold ${
                        value >= MAX_CARGAS ? "text-teal-400" : "text-white"
                      }`}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        );

      case 6:
        return (
          <View className="gap-4">
            <Text className="text-2xl font-bold text-slate-800">
              Ingresos mensuales
            </Text>
            <Text className="text-slate-600">
              Aproximado del hogar (pon 0 si no tienes).
            </Text>
            <Controller
              control={control}
              name="income"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="w-full rounded-2xl border border-teal-200 bg-white p-4 text-xl text-slate-800"
                  placeholder="$ 0"
                  placeholderTextColor="#94a3b8"
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
    <SafeAreaView className="flex-1 bg-teal-50" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          {/* Omitir y ir al inicio */}
          <View className="mb-4 flex-row justify-end">
            <Link href="/home" asChild>
              <TouchableOpacity>
                <Text className="font-medium text-teal-600">Omitir</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Barra de progreso */}
          <View className="mb-8 h-2 overflow-hidden rounded-full bg-teal-100">
            <View
              className="h-full rounded-full bg-teal-600"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
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
          <View className="mt-auto flex-row justify-between gap-3 pt-6">
            <TouchableOpacity
              onPress={prevStep}
              disabled={step === 1}
              className={`w-[45%] rounded-2xl p-4 ${step === 1 ? "opacity-0" : "bg-slate-200"}`}
            >
              <Text className="text-center font-bold text-slate-700">Atrás</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextStep}
              className="w-[45%] rounded-2xl bg-teal-600 p-4 shadow-lg"
            >
              <Text className="text-center font-bold text-white">
                {step === TOTAL_STEPS ? "Finalizar" : "Siguiente"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
