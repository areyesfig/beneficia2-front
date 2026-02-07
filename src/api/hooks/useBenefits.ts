import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { BenefitItem } from "@/features/benefits/components/BenefitsFeed";

export async function fetchBenefits(): Promise<BenefitItem[]> {
  const { data } = await apiClient.get<BenefitItem[]>("/benefits");
  return data;
}

export function useBenefits() {
  return useQuery({
    queryKey: ["benefits"],
    queryFn: fetchBenefits,
  });
}
