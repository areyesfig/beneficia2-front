import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import type { BenefitCardProps } from "./BenefitCard";
import { BenefitCard } from "./BenefitCard";
import { theme } from "@/theme/theme";

export type BenefitItem = BenefitCardProps;

interface BenefitsFeedProps {
  data: BenefitItem[];
  onPostular?: (item: BenefitItem) => void;
  onAction?: (benefitId: string, status: "APPLIED" | "DISMISSED") => void;
  onCompletarPerfil?: (item: BenefitItem) => void;
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  refreshControl?: React.ReactElement;
}

export function BenefitsFeed({
  data,
  onPostular,
  onAction,
  onCompletarPerfil,
  ListEmptyComponent,
  refreshControl,
}: BenefitsFeedProps) {
  const renderItem = ({ item, index }: { item: BenefitItem; index: number }) => (
    <View style={{ marginBottom: 16 }}>
      <BenefitCard
        id={item.id}
        title={item.title}
        description={item.description}
        amount={item.amount}
        deadline={item.deadline}
        status={item.status}
        category={item.category}
        urlApply={item.urlApply}
        missingLabels={item.missingLabels}
        onPostular={onPostular ? () => onPostular(item) : undefined}
        onAction={onAction}
        onCompletarPerfil={
          onCompletarPerfil ? () => onCompletarPerfil(item) : undefined
        }
        index={index}
      />
    </View>
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={280}
      keyExtractor={(item, index) =>
        item.id ? `${item.id}` : `${item.title}-${index}`
      }
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 48,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={refreshControl}
    />
  );
}
