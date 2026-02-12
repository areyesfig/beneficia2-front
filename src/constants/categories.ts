/**
 * Mapeo de categorías: ENUM del backend → etiqueta e icono para la UI.
 * Iconos SVG (Lucide) por ui-ux-pro-max: no emojis en UI.
 */
export const BENEFIT_CATEGORIES = [
  { id: 'ALL', label: 'Todo', iconKey: 'Flame' as const },
  { id: 'BONOS_ESTATALES', label: 'Bonos', iconKey: 'BadgeDollarSign' as const },
  { id: 'VIVIENDA', label: 'Vivienda', iconKey: 'Home' as const },
  { id: 'SALUD_Y_CUIDADOS', label: 'Salud', iconKey: 'HeartPulse' as const },
  { id: 'NINEZ_Y_ADOLESCENCIA', label: 'Niñez', iconKey: 'Baby' as const },
  { id: 'JUVENTUD_Y_ESTUDIOS', label: 'Estudios', iconKey: 'GraduationCap' as const },
  { id: 'ADULTO_MAYOR', label: 'Adulto Mayor', iconKey: 'User' as const },
  { id: 'EMPRENDIMIENTO', label: 'Negocios', iconKey: 'Rocket' as const },
] as const;

/** IDs de categoría (incluye 'ALL' para "ver todos") */
export type BenefitCategoryId = (typeof BENEFIT_CATEGORIES)[number]['id'];

/** Categorías que vienen del backend (sin 'ALL') */
export const BACKEND_CATEGORY_IDS = BENEFIT_CATEGORIES.filter((c) => c.id !== 'ALL').map(
  (c) => c.id
);

/** Normaliza variantes del backend (ej. EDUCACION → JUVENTUD_Y_ESTUDIOS) para filtrar */
export function normalizeCategoryForFilter(backendCategory: string | undefined): string {
  if (!backendCategory) return '';
  const upper = backendCategory.toUpperCase().replace(/\s+/g, '_');
  // Alias comunes que puede devolver el backend
  const alias: Record<string, string> = {
    EDUCACION: 'JUVENTUD_Y_ESTUDIOS',
    SALUD: 'SALUD_Y_CUIDADOS',
  };
  return alias[upper] ?? upper;
}
