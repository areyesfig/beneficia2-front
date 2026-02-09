/**
 * Identificador del usuario actual.
 * - En producción: debe venir de tu capa de autenticación (AuthContext, sesión, etc.).
 * - En desarrollo: opcionalmente EXPO_PUBLIC_DEV_USER_ID en .env para probar sin login.
 * NUNCA subas .env con valores reales; usa .env.example como plantilla.
 */
export function getCurrentUserId(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_DEV_USER_ID;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();
  return null;
}

/**
 * ID a usar en llamadas API cuando no hay usuario autenticado (solo dev/demo).
 * En producción las rutas que requieren usuario deben redirigir a login.
 */
export const ANONYMOUS_DEV_USER_ID = 'anonymous-dev';
