import React from "react";
import { ScrollView, View } from "react-native";
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
}

/**
 * Vista Bento (ui-ux-pro-max): primera card destacada ancho completo,
 * resto en grid 2 columnas con cards compactas.
 */
export function BenefitsGrid({ data, onPostular, onAction, onCompletarPerfil, ListEmptyComponent }: BenefitsGridProps) {
  if (data.length === 0 && ListEmptyComponent) {
    return <>{ListEmptyComponent}</>;
  }

  const [featured, ...rest] = data;
  const gap = theme.spacing.sm;
  const paddingH = theme.spacing.lg;
  const paddingV = theme.spacing.lg;

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: paddingH, paddingTop: paddingV, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {featured && (
        <View style={{ marginBottom: gap }}>
          <BenefitCard
            id={featured.id}
            title={featured.title}
            amount={featured.amount}
            deadline={featured.deadline}
            status={featured.status}
            category={featured.category}
            urlApply={featured.urlApply}
            missingLabels={featured.missingLabels}
            onPostular={onPostular ? () => onPostular(featured) : undefined}
            onAction={onAction}
            onCompletarPerfil={onCompletarPerfil ? () => onCompletarPerfil(featured) : undefined}
          />
        </View>
      )}

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -gap / 2 }}>
        {rest.map((item, index) => (
          <View key={item.id ?? `${item.title}-${index}`} style={{ width: "50%", padding: gap / 2 }}>
            <BenefitCardCompact
              id={item.id}
              title={item.title}
              amount={item.amount}
              deadline={item.deadline}
              status={item.status}
              category={item.category}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
