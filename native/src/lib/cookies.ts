export type Cookie = { name: string; value: string; expiresAt?: number };

const SKIP = new Set(["__cf_bm", "_cfuvid"]);

export function parseSetCookie(header: string, now = Date.now()): Cookie | null {
  const [pair, ...attrs] = header.split(";").map((part) => part.trim());
  if (!pair) return null;
  const eq = pair.indexOf("=");
  if (eq <= 0) return null;
  const name = pair.slice(0, eq).trim();
  const value = pair.slice(eq + 1);
  if (!name || SKIP.has(name)) return null;
  let expiresAt: number | undefined;
  for (const attr of attrs) {
    const split = attr.indexOf("=");
    const key = (split < 0 ? attr : attr.slice(0, split)).trim().toLowerCase();
    const raw = split < 0 ? "" : attr.slice(split + 1).trim();
    if (key === "max-age" && raw) {
      const seconds = Number(raw);
      if (Number.isFinite(seconds)) expiresAt = now + seconds * 1000;
    } else if (key === "expires" && raw) {
      const time = Date.parse(raw);
      if (!Number.isNaN(time)) expiresAt = time;
    }
  }
  return { name, value, expiresAt };
}

export function applySetCookies(jar: Cookie[], lines: string[], now = Date.now()) {
  const map = new Map(jar.map((cookie) => [cookie.name, cookie]));
  for (const line of lines) {
    const cookie = parseSetCookie(line, now);
    if (!cookie) continue;
    if (!cookie.value || (cookie.expiresAt != null && cookie.expiresAt <= now)) map.delete(cookie.name);
    else map.set(cookie.name, cookie);
  }
  return [...map.values()];
}

export function cookieHeader(jar: Cookie[], now = Date.now()) {
  return jar
    .filter((cookie) => cookie.expiresAt == null || cookie.expiresAt > now)
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

type HeaderSource = { get(name: string): string | null; getSetCookie?: () => string[] };

/**
 * Prefer separate Set-Cookie lines. Expo's iOS fetch keeps them on `_rawHeaders`.
 * `Headers` joins duplicates with a comma, which is ambiguous next to an Expires date.
 */
export function readSetCookieHeaders(headers: HeaderSource, rawHeaders?: ReadonlyArray<readonly [string, string]>) {
  const fromPairs = (rawHeaders ?? []).filter(([name]) => name.toLowerCase() === "set-cookie").map(([, value]) => value.trim()).filter(Boolean);
  if (fromPairs.length) return fromPairs;
  if (typeof headers.getSetCookie === "function") {
    const list = headers.getSetCookie().map((line) => line.trim()).filter(Boolean);
    if (list.length) return list;
  }
  const raw = headers.get("set-cookie");
  if (!raw) return [];
  return raw.split(/,(?=\s*[^;,=\s]+=)/).map((line) => line.trim()).filter(Boolean);
}
