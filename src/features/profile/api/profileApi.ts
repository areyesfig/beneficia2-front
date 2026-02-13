import { apiClient } from '@/api/client';

export interface ProfileResponse {
  name?: string;
  birthDate?: string;
  rshPercentage?: number;
  income?: number;
  region?: string;
  commune?: string;
  dependentCount?: number;
  isStudent?: boolean;
  hasDisability?: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  birthDate?: string;
  rshPercentage?: number;
  income?: number;
  region?: string;
  commune?: string;
  dependentCount?: number;
  isStudent?: boolean;
  hasDisability?: boolean;
}

/** Campos mínimos para considerar "perfil completo" (guard de onboarding). Coincide con lo que recoge el wizard (sin región). */
const PROFILE_COMPLETE_FIELDS: (keyof ProfileResponse)[] = [
  'birthDate',
  'rshPercentage',
  'income',
];

export function isProfileComplete(profile: ProfileResponse | null): boolean {
  if (!profile) return false;
  for (const key of PROFILE_COMPLETE_FIELDS) {
    const value = profile[key];
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
  }
  return true;
}

export async function getProfile(userId: string): Promise<ProfileResponse | null> {
  try {
    const { data } = await apiClient.get<ProfileResponse | null>(`/profile/${userId}`);
    return data;
  } catch {
    return null;
  }
}

export async function updateProfile(
  userId: string,
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  const { data } = await apiClient.patch<ProfileResponse>(`/profile/${userId}`, payload);
  return data;
}
