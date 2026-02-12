import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { getCurrentUserId, ANONYMOUS_DEV_USER_ID } from '@/config/env';
import type { BenefitItem } from '@/features/benefits/components/BenefitsFeed';
import type { BenefitStatus } from '@/features/benefits/components/BenefitCard';

/** Beneficio anidado en cada match */
export interface BenefitMatch {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  institution?: string;
  urlApply?: string | null;
  category?: string;
  requirements?: {
    cutoff_date?: string;
    min_rsh_percentage?: number | null;
    requires_family_allowance?: boolean;
    min_age?: number;
    max_income?: number;
    min_income?: number;
    max_rsh_percentage?: number;
  };
  opensAt?: string | null;
  closesAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

/** Hecho que cumples (evidencia) */
export interface EligibleFact {
  key: string;
  label: string;
  value: unknown;
}

/** Hecho que falta */
export interface MissingFact {
  key: string;
  label: string;
  needed?: unknown;
}

/** Explicabilidad del match */
export interface MatchExplanation {
  eligibleFacts: EligibleFact[];
  missingFacts: MissingFact[];
  notes?: string[];
}

/** Requisito faltante con CTA (checklist) */
export interface MissingReqItem {
  key: string;
  label: string;
  severity?: 'INFO' | 'WARN';
  actionType?: string;
  actionLabel?: string;
  actionUrl?: string;
}

/** Respuesta del endpoint /benefits/:userId/match */
export interface MatchResult {
  benefit: BenefitMatch;
  status: 'ELIGIBLE' | 'MISSING_DATA' | string;
  missingRequirements?: string[];
  /** Campos que faltan (keys) */
  match?: {
    status: string;
    matchScore?: number;
    explanation?: MatchExplanation;
    missingFields?: string[];
    missingReqs?: MissingReqItem[];
  };
}

/** Extrae monto de descripciones como "Monto de $61.793 por carga..." */
function parseAmountFromDescription(description: string | undefined): number | null {
  if (!description) return null;
  const match = description.match(/\$\s*([\d.]+)/);
  if (!match) return null;
  const value = parseInt(match[1].replace(/\./g, ''), 10);
  return Number.isNaN(value) ? null : value;
}

/** Formatea fecha ISO (ej. 2025-12-31) a "31 Dic 2025" */
function formatDeadline(isoDate: string | null | undefined): string {
  if (!isoDate) return '--';
  try {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return '--';
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return isoDate;
  }
}

/** Mapea key de campo a label corto para "Te falta: X, Y" */
const MISSING_FIELD_LABELS: Record<string, string> = {
  birthDate: 'Fecha de nacimiento',
  rshPercentage: 'Tramo RSH',
  monthlyIncome: 'Ingresos',
  region: 'Región',
  commune: 'Comuna',
  dependentCount: 'Cargas familiares',
  isStudent: 'Ser estudiante',
  hasDisability: 'Credencial discapacidad',
};

function mapMatchToBenefitItem(match: MatchResult): BenefitItem {
  const b = match.benefit;
  const title = (b.name?.trim()) || 'Beneficio';
  const amount = parseAmountFromDescription(b.description);
  const deadline =
    formatDeadline(b.closesAt ?? b.requirements?.cutoff_date);
  const rawStatus = match.match?.status ?? match.status;
  const status: BenefitStatus =
    rawStatus === 'ELIGIBLE' ? 'ELIGIBLE' : 'MISSING_DATA';
  const category = b.category;
  const urlApply = b.urlApply ?? null;
  const missingFields = match.match?.missingFields ?? [];
  const missingReqs = match.match?.missingReqs ?? [];
  const missingLabels = missingReqs.length > 0
    ? missingReqs.map((r) => r.label)
    : missingFields.map((k) => MISSING_FIELD_LABELS[k] ?? k);

  return {
    id: b.id,
    title,
    amount,
    deadline,
    status,
    category,
    urlApply,
    missingLabels,
  };
}

function getUserId(): string {
  return getCurrentUserId() ?? ANONYMOUS_DEV_USER_ID;
}

export const useUserMatches = () => {
  const userId = getUserId();
  return useQuery({
    queryKey: ['matches', userId],
    queryFn: async () => {
      if (__DEV__) {
        console.log('📡 Fetching benefits match');
      }
      const { data } = await axios.get<MatchResult[]>(
        `${API_URL}/benefits/${userId}/match`
      );
      return data;
    },
  });
};

/** Mapea la respuesta del endpoint de matches al formato de las cards */
export function mapMatchesToBenefitItems(matches: MatchResult[] | undefined): BenefitItem[] {
  if (!matches || !Array.isArray(matches)) return [];
  return matches.map(mapMatchToBenefitItem);
}

/** Hook que devuelve el match de un beneficio por id (reutiliza useUserMatches) */
export function useBenefitDetail(id: string | undefined) {
  const { data: matches, isLoading, error } = useUserMatches();
  const match =
    id && matches?.length
      ? matches.find((m) => String(m.benefit.id) === String(id)) ?? null
      : null;
  return { match, isLoading, error };
}
