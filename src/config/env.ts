import { useAuthStore } from '@/features/auth/authStore';

/**
 * Identificador del usuario actual (guest o registrado).
 * Viene del auth store; tras bootstrapAuth() siempre hay un userId.
 * En desarrollo sin auth: EXPO_PUBLIC_DEV_USER_ID en .env para override.
 */
export function getCurrentUserId(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_DEV_USER_ID;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();
  return useAuthStore.getState().userId ?? null;
}

/**
 * ID a usar en llamadas API cuando no hay usuario autenticado (solo dev/demo).
 * En producción las rutas que requieren usuario deben redirigir a login.
 */
export const ANONYMOUS_DEV_USER_ID = 'anonymous-dev';
