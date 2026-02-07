import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';
import type { BenefitCardProps } from './BenefitCard';
import { BenefitCard } from './BenefitCard';

export type BenefitItem = BenefitCardProps;

interface BenefitsFeedProps {
  data: BenefitItem[];
  onPostular?: (item: BenefitItem) => void;
}

export function BenefitsFeed({ data, onPostular }: BenefitsFeedProps) {
  const renderItem = ({ item }: { item: BenefitItem }) => (
    <View className="mb-3 px-1">
      <BenefitCard
        title={item.title}
        amount={item.amount}
        deadline={item.deadline}
        status={item.status}
        onPostular={onPostular ? () => onPostular(item) : undefined}
      />
    </View>
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={140}
      keyExtractor={(item, index) => `${item.title}-${index}`}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
