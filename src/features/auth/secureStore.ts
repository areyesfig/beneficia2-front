import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_ID: 'auth_user_id',
  DEVICE_ID: 'auth_device_id',
} as const;

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

export async function getUserId(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.USER_ID);
}

export async function getDeviceId(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.DEVICE_ID);
}

export async function setTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
    SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
  ]);
}

export async function setUserId(userId: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.USER_ID, userId);
}

export async function setDeviceId(deviceId: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId);
}

export async function clearAuth(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
    SecureStore.deleteItemAsync(KEYS.USER_ID),
  ]);
}
