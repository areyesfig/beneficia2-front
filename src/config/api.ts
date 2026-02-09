import { Platform } from 'react-native';

/**
 * URL base del backend. NUNCA pongas API keys aquí.
 * En producción define EXPO_PUBLIC_API_URL en tu pipeline (EAS Secrets o .env).
 */
const getApiUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();
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
