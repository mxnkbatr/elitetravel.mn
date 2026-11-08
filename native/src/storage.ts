import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { readChunked, removeChunked, writeChunked, type Kv } from "./lib/chunks";

async function secureAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export const kv: Kv = {
  async get(key) {
    if (await secureAvailable()) return SecureStore.getItemAsync(key);
    return AsyncStorage.getItem(key);
  },
  async set(key, value) {
    if (await secureAvailable()) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  async remove(key) {
    if (await secureAvailable()) {
      await SecureStore.deleteItemAsync(key).catch(() => {});
      return;
    }
    await AsyncStorage.removeItem(key);
  },
};

export function writeJson(key: string, value: unknown) {
  return writeChunked(kv, key, JSON.stringify(value));
}

export async function readJson<T>(key: string): Promise<T | null> {
  const raw = await readChunked(kv, key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function removeJson(key: string) {
  return removeChunked(kv, key);
}

/** Face ID secret. Reading it is what shows the system prompt. Unavailable on web. */
export async function writeBiometricSecret(key: string, value: string, prompt: string) {
  if (!(await secureAvailable())) throw new Error("Энэ төхөөрөмж дээр Face ID түлхүүр хадгалах боломжгүй.");
  await SecureStore.setItemAsync(key, value, { requireAuthentication: true, authenticationPrompt: prompt });
}

export async function readBiometricSecret(key: string, prompt: string) {
  if (!(await secureAvailable())) throw new Error("Энэ төхөөрөмж дээр Face ID ашиглах боломжгүй.");
  try {
    return await SecureStore.getItemAsync(key, { requireAuthentication: true, authenticationPrompt: prompt });
  } catch {
    throw new Error("Face ID баталгаажсангүй.");
  }
}

export async function deleteBiometricSecret(key: string) {
  if (!(await secureAvailable())) return;
  await SecureStore.deleteItemAsync(key, { requireAuthentication: false }).catch(() => {});
}
