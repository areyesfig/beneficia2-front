import { create } from 'zustand';
import * as authApi from './authApi';
import * as secureStore from './secureStore';
import { setupAuthInterceptors } from '@/api/client';

function generateDeviceId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isBootstrapped: boolean;
  bootstrapAuth: () => Promise<void>;
  setTokens: (userId: string, accessToken: string, refreshToken: string) => Promise<void>;
  refreshAndGetNewToken: () => Promise<string | null>;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  accessToken: null,
  refreshToken: null,
  isBootstrapped: false,

  bootstrapAuth: async () => {
    const existing = await secureStore.getAccessToken();
    const existingRefresh = await secureStore.getRefreshToken();
    const existingUserId = await secureStore.getUserId();

    if (existing && existingRefresh && existingUserId) {
      set({
        userId: existingUserId,
        accessToken: existing,
        refreshToken: existingRefresh,
        isBootstrapped: true,
      });
      return;
    }

    let deviceId = await secureStore.getDeviceId();
    if (!deviceId) {
      deviceId = generateDeviceId();
      await secureStore.setDeviceId(deviceId);
    }

    const tokens = await authApi.authGuest(deviceId);
    await secureStore.setTokens(tokens.accessToken, tokens.refreshToken);
    await secureStore.setUserId(tokens.userId);
    set({
      userId: tokens.userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isBootstrapped: true,
    });
  },

  setTokens: async (userId, accessToken, refreshToken) => {
    await secureStore.setTokens(accessToken, refreshToken);
    await secureStore.setUserId(userId);
    set({ userId, accessToken, refreshToken });
  },

  refreshAndGetNewToken: async () => {
    const refresh = get().refreshToken;
    if (!refresh) return null;
    try {
      const pair = await authApi.authRefresh(refresh);
      await secureStore.setTokens(pair.accessToken, pair.refreshToken);
      set({
        accessToken: pair.accessToken,
        refreshToken: pair.refreshToken,
      });
      return pair.accessToken;
    } catch {
      // Refresh falló: limpiar tokens y re-crear sesión guest
      await get().clearAuth();
      await get().bootstrapAuth();
      return get().accessToken;
    }
  },

  clearAuth: async () => {
    await secureStore.clearAuth();
    set({ userId: null, accessToken: null, refreshToken: null });
  },
}));

setupAuthInterceptors({
  getAccessToken: () => useAuthStore.getState().accessToken,
  refreshAndGetNewToken: () =>
    useAuthStore.getState().refreshAndGetNewToken(),
});
