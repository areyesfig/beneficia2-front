/**
 * Utilidades para validar y formatear RUT chileno.
 * El RUT usa dígito verificador módulo 11 (0-9 o K para 10).
 */

const RUT_CHECK_DIGIT_K = 'K';
const RUT_WEIGHTS = [2, 3, 4, 5, 6, 7] as const;

/**
 * Limpia el RUT: quita puntos, guión y deja el cuerpo numérico + dígito verificador.
 * Convierte 'k' a 'K'.
 */
export function cleanRut(value: string): string {
  if (!value || typeof value !== 'string') return '';
  return value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '')
    .toUpperCase();
}

/**
 * Calcula el dígito verificador para el cuerpo del RUT (solo números).
 */
export function getCheckDigit(rutBody: string): string {
  const digits = rutBody.replace(/\D/g, '');
  if (digits.length === 0) return '';

  let sum = 0;
  for (let i = digits.length - 1, w = 0; i >= 0; i--, w++) {
    sum += parseInt(digits[i], 10) * RUT_WEIGHTS[w % RUT_WEIGHTS.length];
  }
  const remainder = sum % 11;
  const check = 11 - remainder;
  if (check === 11) return '0';
  if (check === 10) return RUT_CHECK_DIGIT_K;
  return String(check);
}

/**
 * Valida un RUT chileno (con o sin puntos/guión).
 * Acepta formato: 12.345.678-9, 12345678-9, 123456789.
 */
export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return false;

  const body = cleaned.slice(0, -1);
  const givenDigit = cleaned.slice(-1);

  if (!/^\d+$/.test(body)) return false;
  if (!/^[\dK]$/.test(givenDigit)) return false;

  const expectedDigit = getCheckDigit(body);
  return givenDigit === expectedDigit;
}

/**
 * Formatea un RUT al estilo chileno: XX.XXX.XXX-X
 * Acepta entrada con o sin puntos/guión; el guión se coloca antes del dígito verificador.
 * El cuerpo puede tener 7 u 8 dígitos; el último carácter se considera dígito verificador.
 */
export function formatRut(value: string): string {
  const cleaned = cleanRut(value);
  if (cleaned.length === 0) return '';

  // RUT válido: 7 u 8 dígitos en cuerpo + 1 dígito verificador (8 o 9 caracteres)
  const hasCheckDigit = cleaned.length === 8 || cleaned.length === 9;
  const body = hasCheckDigit ? cleaned.slice(0, -1).replace(/\D/g, '') : cleaned.replace(/\D/g, '');
  const digit = hasCheckDigit ? cleaned.slice(-1).toUpperCase() : '';

  if (body.length === 0) return digit === 'K' ? 'K' : '';

  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return digit ? `${formattedBody}-${digit}` : formattedBody;
}

/**
 * Formatea mientras el usuario escribe (solo números y K).
 * Útil para inputs: va mostrando XX.XXX.XXX-X sin permitir caracteres inválidos.
 */
export function formatRutInput(value: string): string {
  const cleaned = value.replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '').toUpperCase();
  const valid = cleaned.replace(/[^\dK]/g, '');
  if (valid.length === 0) return '';
  if (valid.length === 1 && /[K]/.test(valid)) return '';
  const body = valid.slice(0, -1).replace(/\D/g, '');
  const digit = valid.slice(-1);
  if (body.length === 0) return digit === 'K' ? '' : digit;
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${digit}`;
}
