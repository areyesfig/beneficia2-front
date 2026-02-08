import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { z } from 'zod';
import { validateRut, formatRutInput } from '@/utils/rut-validator';

const TRAMOS_RSH = [40, 50, 60, 70, 80, 90, 100] as const;
const MIN_CARGAS = 0;
const MAX_CARGAS = 20;
const TOTAL_STEPS = 3;

const rshWizardSchema = z.object({
  rut: z
    .string()
    .min(8, 'Ingresa un RUT')
    .refine((val) => validateRut(val), 'RUT chileno inválido'),
  tramo: z
    .number()
    .refine((n) => TRAMOS_RSH.includes(n as (typeof TRAMOS_RSH)[number]), 'Selecciona un tramo'),
  cargasFamiliares: z
    .number()
    .min(MIN_CARGAS, `Mínimo ${MIN_CARGAS}`)
    .max(MAX_CARGAS, `Máximo ${MAX_CARGAS}`),
});

export type RSHWizardFormValues = z.infer<typeof rshWizardSchema>;

const defaultValues: RSHWizardFormValues = {
  rut: '',
  tramo: 40,
  cargasFamiliares: 0,
};

export function RSHWizard() {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RSHWizardFormValues>({
    resolver: zodResolver(rshWizardSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const [step, setStep] = useState(1);

  const goNext = async () => {
    if (step === 1) {
      const valid = await trigger('rut');
      if (valid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = (data: RSHWizardFormValues) => {
    console.log('RSH Wizard submitted:', data);
    // Aquí puedes navegar o enviar al API
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-teal-50"
    >
      <ScrollView
        className="flex-1 bg-teal-50"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stepper */}
        <View className="mb-8 mt-8 flex-row items-center">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <View className="items-center">
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${
                    s === step
                      ? 'bg-teal-600'
                      : s < step
                        ? 'bg-teal-400'
                        : 'bg-teal-100'
                  }`}
                >
                  <Text
                    className={`font-semibold ${s <= step ? 'text-white' : 'text-slate-500'}`}
                  >
                    {s}
                  </Text>
                </View>
                <Text className="mt-1 text-xs text-slate-500">Paso {s}</Text>
              </View>
              {s < 3 && <View className="mx-2 h-0.5 w-12 bg-teal-200" />}
            </React.Fragment>
          ))}
        </View>

        {/* Paso 1: RUT */}
        {step === 1 && (
          <View className="gap-4 rounded-3xl bg-white p-5 shadow-lg">
            <Text className="text-lg font-bold text-slate-900">RUT del titular</Text>
            <Text className="text-slate-500">
              Ingresa el RUT de quien postula al Registro Social de Hogares.
            </Text>
            <Controller
              control={control}
              name="rut"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    className={`rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 ${
                      errors.rut ? 'border-red-500' : 'border-teal-200'
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
                    <Text className="mt-1.5 text-sm text-red-500">{errors.rut.message}</Text>
                  )}
                </View>
              )}
            />
          </View>
        )}

        {/* Paso 2: Tramo RSH */}
        {step === 2 && (
          <View className="gap-4 rounded-3xl bg-white p-5 shadow-lg">
            <Text className="text-lg font-bold text-slate-900">Tramo RSH</Text>
            <Text className="text-slate-500">
              Selecciona el tramo que corresponde a tu grupo familiar.
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {TRAMOS_RSH.map((t) => (
                <Controller
                  key={t}
                  control={control}
                  name="tramo"
                  render={({ field: { onChange, value } }) => {
                    const selected = value === t;
                    return (
                      <Pressable
                        onPress={() => onChange(t)}
                        className={`rounded-full px-6 py-3 ${
                          selected ? 'bg-teal-600' : 'bg-teal-50 border border-teal-100'
                        }`}
                      >
                        <Text
                          className={`text-base font-semibold ${
                            selected ? 'text-white' : 'text-teal-800'
                          }`}
                        >
                          {t}%
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Paso 3: Cargas familiares */}
        {step === 3 && (
          <View className="gap-4 rounded-3xl bg-white p-5 shadow-lg">
            <Text className="text-lg font-bold text-slate-900">Cargas familiares</Text>
            <Text className="text-slate-500">
              Número de personas que dependen económicamente de ti (hijos, cónyuge, etc.).
            </Text>
            <Controller
              control={control}
              name="cargasFamiliares"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center justify-center gap-6 py-4">
                  <Pressable
                    onPress={() => onChange(Math.max(MIN_CARGAS, value - 1))}
                    disabled={value <= MIN_CARGAS}
                    className={`h-14 w-14 items-center justify-center rounded-full ${
                      value <= MIN_CARGAS ? 'bg-teal-100' : 'bg-teal-600'
                    }`}
                  >
                    <Text
                      className={`text-2xl font-bold ${
                        value <= MIN_CARGAS ? 'text-teal-400' : 'text-white'
                      }`}
                    >
                      −
                    </Text>
                  </Pressable>
                  <Text className="min-w-[3rem] text-center text-3xl font-bold text-slate-900">
                    {value}
                  </Text>
                  <Pressable
                    onPress={() => onChange(Math.min(MAX_CARGAS, value + 1))}
                    disabled={value >= MAX_CARGAS}
                    className={`h-14 w-14 items-center justify-center rounded-full ${
                      value >= MAX_CARGAS ? 'bg-teal-100' : 'bg-teal-600'
                    }`}
                  >
                    <Text
                      className={`text-2xl font-bold ${
                        value >= MAX_CARGAS ? 'text-teal-400' : 'text-white'
                      }`}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        )}

        {/* Botones navegación */}
        <View className="mt-10 flex-row gap-3">
          {step > 1 && (
            <Pressable
              onPress={goBack}
              className="flex-1 items-center rounded-2xl border border-teal-200 bg-white py-3.5"
            >
              <Text className="font-semibold text-slate-700">Atrás</Text>
            </Pressable>
          )}
          <Pressable
            onPress={goNext}
            className="flex-1 rounded-2xl bg-teal-600 py-3.5"
            style={{ alignItems: 'center' }}
          >
            <Text className="font-semibold text-white">
              {step < TOTAL_STEPS ? 'Siguiente' : 'Completar'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
