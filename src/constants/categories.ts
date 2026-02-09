/**
 * Mapeo de categorías: ENUM del backend → etiqueta e icono para la UI.
 * Usado en chips de filtro y en tarjetas de beneficio.
 */
export const BENEFIT_CATEGORIES = [
  { id: 'ALL', label: 'Todo', icon: '🔥' },
  { id: 'BONOS_ESTATALES', label: 'Bonos', icon: '💰' },
  { id: 'VIVIENDA', label: 'Vivienda', icon: '🏠' },
  { id: 'SALUD_Y_CUIDADOS', label: 'Salud', icon: '🏥' },
  { id: 'NINEZ_Y_ADOLESCENCIA', label: 'Niñez', icon: '🧸' },
  { id: 'JUVENTUD_Y_ESTUDIOS', label: 'Estudios', icon: '🎓' },
  { id: 'ADULTO_MAYOR', label: 'Adulto Mayor', icon: '👴' },
  { id: 'EMPRENDIMIENTO', label: 'Negocios', icon: '🚀' },
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
