import { Platform } from 'react-native';

const ALLOWED_PROTOCOLS = ['https:'] as const;

/**
 * URL base del backend. NUNCA pongas API keys aquí.
 * En producción define EXPO_PUBLIC_API_URL en tu pipeline (EAS Secrets o .env).
 * En producción solo se permiten URLs HTTPS.
 */
const getApiUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv && fromEnv.trim()) {
    const url = fromEnv.trim();
    if (!__DEV__) {
      try {
        const parsed = new URL(url);
        if (!ALLOWED_PROTOCOLS.includes(parsed.protocol as (typeof ALLOWED_PROTOCOLS)[number])) {
          console.warn('[security] EXPO_PUBLIC_API_URL debe usar HTTPS en producción. Usando fallback.');
          return 'https://api.example.com';
        }
      } catch {
        console.warn('[security] EXPO_PUBLIC_API_URL no es una URL válida.');
        return 'https://api.example.com';
      }
    }
    return url;
  }
  // Solo desarrollo local: emulador Android usa 10.0.2.2 para alcanzar el host; resto usa EXPO_PUBLIC_DEV_API_HOST
  if (__DEV__) {
    const devHost =
      process.env.EXPO_PUBLIC_DEV_API_HOST ??
      (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
    const port = process.env.EXPO_PUBLIC_DEV_API_PORT ?? '3000';
    return Platform.select({
      ios: `http://${devHost}:${port}`,
      android: `http://${devHost}:${port}`,
      default: `http://${devHost}:${port}`,
    }) as string;
  }
  return 'https://api.example.com';
};

export const API_URL = getApiUrl();
