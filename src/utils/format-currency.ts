/**
 * Formatea un número como pesos chilenos (CLP).
 * Ej: 98750 → "$ 98.750"
 */

const LOCALE_CL = "es-CL";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "$ --";
  return `$ ${amount.toLocaleString(LOCALE_CL)}`;
}

/**
 * Formatea con símbolo y sin espacio (para diseños compactos).
 */
export function formatCurrencyCompact(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "$ --";
  return `$${amount.toLocaleString(LOCALE_CL)}`;
}
