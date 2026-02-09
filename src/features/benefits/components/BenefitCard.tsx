import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import {
  Home,
  Gift,
  CircleDollarSign,
  ChevronRight,
  GraduationCap,
  Heart,
  Baby,
  User,
  Rocket,
  type LucideIcon,
} from 'lucide-react-native';
import { formatCurrency } from '@/utils/format-currency';

export type BenefitStatus = 'ELIGIBLE' | 'MISSING_DATA';

export interface BenefitCardProps {
  id?: string;
  title: string;
  amount?: number | null;
  deadline: string;
  status: BenefitStatus;
  category?: string;
  onPostular?: () => void;
}

const CATEGORY_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  VIVIENDA: { Icon: Home, bg: 'bg-teal-100', color: '#0d9488' },
  BONOS_ESTATALES: { Icon: Gift, bg: 'bg-teal-100', color: '#0f766e' },
  SALUD_Y_CUIDADOS: { Icon: Heart, bg: 'bg-teal-100', color: '#0d9488' },
  SALUD: { Icon: Heart, bg: 'bg-teal-100', color: '#0d9488' },
  NINEZ_Y_ADOLESCENCIA: { Icon: Baby, bg: 'bg-teal-100', color: '#0f766e' },
  JUVENTUD_Y_ESTUDIOS: { Icon: GraduationCap, bg: 'bg-teal-100', color: '#0d9488' },
  EDUCACION: { Icon: GraduationCap, bg: 'bg-teal-100', color: '#0d9488' },
  ADULTO_MAYOR: { Icon: User, bg: 'bg-teal-100', color: '#0f766e' },
  EMPRENDIMIENTO: { Icon: Rocket, bg: 'bg-teal-100', color: '#0d9488' },
  default: { Icon: CircleDollarSign, bg: 'bg-slate-100', color: '#64748b' },
};

function getCategoryStyle(category?: string) {
  if (!category) return CATEGORY_ICON.default;
  const key = category.toUpperCase().replace(/\s+/g, '_');
  return CATEGORY_ICON[key] ?? CATEGORY_ICON.default;
}

export function BenefitCard({
  id,
  title,
  amount,
  deadline,
  status,
  category,
  onPostular,
}: BenefitCardProps) {
  const isEligible = status === 'ELIGIBLE';
  const { Icon, bg, color } = getCategoryStyle(category);

  const cardContent = (
    <>
      {/* Header: icono izquierda + badge derecha */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className={`h-10 w-10 items-center justify-center rounded-full ${bg}`}>
          <Icon size={22} color={color} strokeWidth={2} />
        </View>
        <View
          className={`rounded-full px-3 py-1 ${
            isEligible ? 'bg-teal-100' : 'bg-amber-50'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isEligible ? 'text-teal-700' : 'text-amber-700'
            }`}
          >
            {isEligible ? 'Disponible' : 'Falta info'}
          </Text>
        </View>
      </View>

      {/* Cuerpo: título + monto */}
      <Text className="text-lg font-bold text-slate-800" numberOfLines={2}>
        {title}
      </Text>
      <Text className="mt-2 text-2xl font-extrabold tracking-tight text-teal-700">
        {formatCurrency(amount)}
      </Text>
      <Text className="mt-1 text-sm text-slate-500">Vence: {deadline}</Text>

      {/* Barra de progreso cuando falta requisito */}
      {!isEligible && (
        <View className="mt-4">
          <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <View
              className="h-full rounded-full bg-amber-500"
              style={{ width: '50%' }}
            />
          </View>
          <Text className="mt-1.5 text-xs text-slate-500">1 de 2 requisitos</Text>
        </View>
      )}

      {/* Footer: flecha indicando que es tocable */}
      <View className="mt-4 flex-row justify-end">
        <ChevronRight size={20} color="#64748b" strokeWidth={2} />
      </View>
    </>
  );

  const pressableClassName = 'rounded-3xl bg-white p-5 shadow-lg active:opacity-95';

  if (id) {
    const query = new URLSearchParams({
      title: title ?? '',
      status,
      deadline: deadline ?? '',
      amount: amount != null ? String(amount) : '',
    });
    const href = `/benefit/${id}?${query.toString()}`;
    return (
      <Link href={href} asChild>
        <Pressable className={pressableClassName}>{cardContent}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable onPress={onPostular} className={pressableClassName}>
      {cardContent}
    </Pressable>
  );
}
