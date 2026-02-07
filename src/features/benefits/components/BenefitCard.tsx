import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { formatCurrency } from '@/utils/format-currency';

export type BenefitStatus = 'ELIGIBLE' | 'MISSING_DATA';

export interface BenefitCardProps {
  title: string;
  amount: number;
  deadline: string;
  status: BenefitStatus;
  onPostular?: () => void;
}

export function BenefitCard({ title, amount, deadline, status, onPostular }: BenefitCardProps) {
  const isEligible = status === 'ELIGIBLE';

  return (
    <View
      className={`rounded-xl bg-white p-4 shadow-md ${
        isEligible ? 'border-2 border-green-500' : 'border-2 border-amber-400'
      }`}
    >
      <Text className="text-lg font-semibold text-gray-900" numberOfLines={2}>
        {title}
      </Text>
      <Text className="mt-1 text-base font-medium text-gray-700">
        {formatCurrency(amount)}
      </Text>
      <Text className="mt-0.5 text-sm text-gray-500">Vence: {deadline}</Text>

      {isEligible ? (
        <Pressable
          onPress={onPostular}
          className="mt-4 self-start rounded-lg bg-green-600 px-4 py-2 active:opacity-80"
        >
          <Text className="font-semibold text-white">Postular</Text>
        </Pressable>
      ) : (
        <Text className="mt-4 text-sm font-medium text-amber-700">
          Te falta 1 requisito
        </Text>
      )}
    </View>
  );
}
