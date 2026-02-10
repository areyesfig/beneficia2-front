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
  // Solo desarrollo local: fallback para emulador/dispositivo en la misma red
  if (__DEV__) {
    const devHost = process.env.EXPO_PUBLIC_DEV_API_HOST ?? '192.168.68.107';
    return Platform.select({
      ios: `http://${devHost}:3000`,
      android: `http://${devHost}:3000`,
      default: `http://${devHost}:3000`,
    }) as string;
  }
  return 'https://api.example.com';
};

export const API_URL = getApiUrl();
