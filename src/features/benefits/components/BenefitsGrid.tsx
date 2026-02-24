import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import type { BenefitItem } from "./BenefitsFeed";
import { BenefitCard } from "./BenefitCard";
import { BenefitCardCompact } from "./BenefitCardCompact";
import { theme } from "@/theme/theme";

interface BenefitsGridProps {
  data: BenefitItem[];
  onPostular?: (item: BenefitItem) => void;
  onAction?: (benefitId: string, status: "APPLIED" | "DISMISSED") => void;
  onCompletarPerfil?: (item: BenefitItem) => void;
  ListEmptyComponent?: React.ReactElement | null;
  refreshControl?: React.ReactElement;
}

/**
 * Vista Bento: primera card destacada ancho completo,
 * resto en grid 2 columnas con cards compactas + animación staggered.
 */
export function BenefitsGrid({
  data,
  onPostular,
  onAction,
  onCompletarPerfil,
  ListEmptyComponent,
  refreshControl,
}: BenefitsGridProps) {
  if (data.length === 0 && ListEmptyComponent) {
    return <>{ListEmptyComponent}</>;
  }

  const [featured, ...rest] = data;

  return (
    <ScrollView
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {featured && (
        <View style={s.featuredWrap}>
          <BenefitCard
            id={featured.id}
            title={featured.title}
            description={featured.description}
            amount={featured.amount}
            deadline={featured.deadline}
            status={featured.status}
            category={featured.category}
            urlApply={featured.urlApply}
            missingLabels={featured.missingLabels}
            onPostular={onPostular ? () => onPostular(featured) : undefined}
            onAction={onAction}
            onCompletarPerfil={
              onCompletarPerfil ? () => onCompletarPerfil(featured) : undefined
            }
            index={0}
          />
        </View>
      )}

      <View style={s.grid}>
        {rest.map((item, idx) => (
          <View
            key={item.id ?? `${item.title}-${idx}`}
            style={s.gridItem}
          >
            <BenefitCardCompact
              id={item.id}
              title={item.title}
              description={item.description}
              amount={item.amount}
              deadline={item.deadline}
              status={item.status}
              category={item.category}
              index={idx}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const GAP = 10;

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  featuredWrap: {
    marginBottom: GAP + 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -GAP / 2,
  },
  gridItem: {
    width: "50%",
    padding: GAP / 2,
    paddingBottom: GAP,
  },
});
