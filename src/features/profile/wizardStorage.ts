import * as SecureStore from "expo-secure-store";

const KEY_PROFILE = "wizard_profile";
const KEY_CLEARED = "wizard_cleared";

export interface StoredWizardProfile {
  name: string;
  age: string;
  rut: string;
  rsh: number;
  cargasFamiliares: number;
  income: string;
}

export async function getStoredWizardProfile(): Promise<StoredWizardProfile | null> {
  try {
    const raw = await SecureStore.getItemAsync(KEY_PROFILE);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredWizardProfile;
    return data && typeof data.name === "string" ? data : null;
  } catch {
    return null;
  }
}

export async function setStoredWizardProfile(data: StoredWizardProfile): Promise<void> {
  await SecureStore.setItemAsync(KEY_PROFILE, JSON.stringify(data));
}

export async function clearStoredWizardProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_PROFILE);
}

export async function isWizardCleared(): Promise<boolean> {
  const raw = await SecureStore.getItemAsync(KEY_CLEARED);
  return raw === "1";
}

export async function setWizardCleared(value: boolean): Promise<void> {
  if (value) {
    await SecureStore.setItemAsync(KEY_CLEARED, "1");
  } else {
    await SecureStore.deleteItemAsync(KEY_CLEARED);
  }
}

/** Limpia datos del wizard y marca que el usuario quiere empezar de nuevo. */
export async function clearWizardData(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEY_PROFILE),
    SecureStore.setItemAsync(KEY_CLEARED, "1"),
  ]);
}
