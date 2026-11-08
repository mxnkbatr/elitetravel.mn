export const CHUNK = 1800;

export type Kv = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
};

export function chunkValue(value: string, size = CHUNK) {
  if (value.length === 0) return [""];
  const parts: string[] = [];
  for (let i = 0; i < value.length; i += size) parts.push(value.slice(i, i + size));
  return parts;
}

export async function writeChunked(store: Kv, key: string, value: string) {
  const parts = chunkValue(value);
  const countKey = `${key}.n`;
  const previous = Number((await store.get(countKey)) ?? "0");
  await store.set(countKey, String(parts.length));
  for (let i = 0; i < parts.length; i++) await store.set(`${key}.${i}`, parts[i]);
  for (let i = parts.length; i < previous; i++) await store.remove(`${key}.${i}`);
}

export async function readChunked(store: Kv, key: string) {
  const count = Number((await store.get(`${key}.n`)) ?? "0");
  if (!Number.isInteger(count) || count <= 0) return null;
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const part = await store.get(`${key}.${i}`);
    if (part == null) return null;
    parts.push(part);
  }
  return parts.join("");
}

export async function removeChunked(store: Kv, key: string) {
  const count = Number((await store.get(`${key}.n`)) ?? "0");
  await store.remove(`${key}.n`);
  for (let i = 0; i < count; i++) await store.remove(`${key}.${i}`);
}
