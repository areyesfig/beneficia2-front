import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';
import type { BenefitCardProps } from './BenefitCard';
import { BenefitCard } from './BenefitCard';

export type BenefitItem = BenefitCardProps;

interface BenefitsFeedProps {
  data: BenefitItem[];
  onPostular?: (item: BenefitItem) => void;
  /** Gamificación: notifica "Postulé" u "Ocultar" por beneficio (dispara confetti en pantalla lista) */
  onAction?: (benefitId: string, status: 'APPLIED' | 'DISMISSED') => void;
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
}

export function BenefitsFeed({ data, onPostular, onAction, ListEmptyComponent }: BenefitsFeedProps) {
  const renderItem = ({ item }: { item: BenefitItem }) => (
    <View className="mb-5">
      <BenefitCard
        id={item.id}
        title={item.title}
        amount={item.amount}
        deadline={item.deadline}
        status={item.status}
        category={item.category}
        urlApply={item.urlApply}
        onPostular={onPostular ? () => onPostular(item) : undefined}
        onAction={onAction}
      />
    </View>
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={140}
      keyExtractor={(item, index) => item.id ? `${item.id}` : `${item.title}-${index}`}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
