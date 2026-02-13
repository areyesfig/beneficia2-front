import { apiClient } from '@/api/client';

export interface AuthTokens {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface MeUser {
  id: string;
  type: 'GUEST' | 'REGISTERED';
  rut: string;
  email: string | null;
  createdAt: string;
}

export async function authGuest(deviceId: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/guest', {
    deviceId,
  });
  return data;
}

export async function authRegister(params: {
  deviceId: string;
  email: string;
  password: string;
}): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/register', params);
  return data;
}

export async function authLogin(params: {
  email: string;
  password: string;
}): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/login', params);
  return data;
}

export async function authRefresh(refreshToken: string): Promise<TokenPair> {
  const { data } = await apiClient.post<TokenPair>('/auth/refresh', {
    refreshToken,
  });
  return data;
}

export async function authLogout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}

export async function authMe(): Promise<MeUser> {
  const { data } = await apiClient.get<MeUser>('/auth/me');
  return data;
}
