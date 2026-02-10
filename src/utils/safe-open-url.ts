import { Linking } from 'react-native';

/** Protocolos permitidos al abrir URLs externas (evita javascript:, file:, etc.). */
const ALLOWED_PROTOCOLS = ['https:', 'http:'] as const;

/**
 * Comprueba si una URL es segura para abrir (solo https en producción, https/http en __DEV__).
 * Evita open redirect y XSS vía javascript: o data:.
 */
export function isSafeExternalUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol as (typeof ALLOWED_PROTOCOLS)[number];
    if (__DEV__) {
      return ALLOWED_PROTOCOLS.includes(protocol);
    }
    return protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Abre una URL solo si pasa la validación de seguridad.
 * @returns true si se intentó abrir correctamente, false si la URL no es segura o falló
 */
export async function openSafeUrl(url: string | null | undefined): Promise<boolean> {
  if (!isSafeExternalUrl(url)) return false;
  try {
    await Linking.openURL(url!.trim());
    return true;
  } catch {
    return false;
  }
}
