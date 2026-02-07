import { useBenefits } from "@/api";
import { BenefitsFeed } from "@/features/benefits/components/BenefitsFeed";
import type { BenefitItem } from "@/features/benefits/components/BenefitsFeed";
import { View, ActivityIndicator } from "react-native";

const MOCK_BENEFITS: BenefitItem[] = [
  { title: "Bono al Trabajo de la Mujer", amount: 98750, deadline: "31 Mar 2025", status: "ELIGIBLE" },
  { title: "Subsidio Único Familiar", amount: 45000, deadline: "15 Abr 2025", status: "MISSING_DATA" },
  { title: "Bono por Asistencia Escolar", amount: 21000, deadline: "30 Abr 2025", status: "ELIGIBLE" },
];

export default function BenefitsScreen() {
  const { data, isLoading } = useBenefits();
  const benefits = data ?? MOCK_BENEFITS;

  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <BenefitsFeed data={benefits} onPostular={(item) => console.log("Postular", item.title)} />
    </View>
  );
}
