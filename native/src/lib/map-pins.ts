/**
 * Published pins from the website map (`src/components/DestinationMap.tsx`).
 * The booking API does not send coordinates. Unknown destination keys are omitted.
 */
export const MAP_HUB = { key: "ub", name: "Улаанбаатар", latitude: 47.918, longitude: 106.917 } as const;

export const PUBLISHED_PINS = [
  { key: "hainan", name: "Хайнань", latitude: 18.247, longitude: 109.508 },
  { key: "hongkong", name: "Хонг Конг", latitude: 22.3193, longitude: 114.1694 },
  { key: "bali", name: "Бали", latitude: -8.4095, longitude: 115.1889 },
  { key: "egypt", name: "Египет", latitude: 30.0444, longitude: 31.2357 },
] as const;

/** Names and flight labels copied from the website map card, not from a live feed. */
export const MAP_DESTINATIONS = [
  { ...PUBLISHED_PINS[0], en: "Hainan", blurb: "Саняагийн далай, Атлантис усан парк, тогтмол огноотой аялал", flightTime: "5 цаг", flightLabel: "Шууд нислэг" },
  { ...PUBLISHED_PINS[1], en: "Hong Kong", blurb: "Викториа оргил, гэрэлт хот, The Weeknd тоглолт", flightTime: "4ц 40м", flightLabel: "Шууд нислэг" },
  { ...PUBLISHED_PINS[2], en: "Bali", blurb: "Нуса Пенида, Убуд, Диваажингийн хаалга — хүссэн үедээ", flightTime: "Дамжин", flightLabel: "Нислэг" },
  { ...PUBLISHED_PINS[3], en: "Egypt", blurb: "Удахгүй — SHAKIRA үзвэртэй аялал", flightTime: "—", flightLabel: "Нислэг" },
] as const;

export type MapPin = (typeof MAP_DESTINATIONS)[number];

export function stepDestination(index: number, step: number, length = MAP_DESTINATIONS.length) {
  if (length <= 0) return 0;
  return (index + step + length) % length;
}

/** Same bowed flight arc the website draws from Ulaanbaatar. */
export function flightArc(to: { longitude: number; latitude: number }, steps = 32) {
  const x0 = MAP_HUB.longitude;
  const y0 = MAP_HUB.latitude;
  const x2 = to.longitude;
  const y2 = to.latitude;
  const dx = x2 - x0;
  const dy = y2 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(18, len * 0.28);
  const cx = (x0 + x2) / 2 - (dy / len) * bow;
  const cy = (y0 + y2) / 2 + (dx / len) * bow;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    return { longitude: u * u * x0 + 2 * u * t * cx + t * t * x2, latitude: u * u * y0 + 2 * u * t * cy + t * t * y2 };
  });
}

export function arcBounds(points: { longitude: number; latitude: number }[]) {
  const lngs = points.map((point) => point.longitude);
  const lats = points.map((point) => point.latitude);
  return { west: Math.min(...lngs), south: Math.min(...lats), east: Math.max(...lngs), north: Math.max(...lats) };
}

/** Keyless style used by the website map. No tile credential. */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Opening frame copied from the website map's first fitBounds call. */
export const OPENING_BOUNDS = [28, -12, 120, 50] as [number, number, number, number];

export function routeCollection(): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: MAP_DESTINATIONS.map((pin) => ({
      type: "Feature",
      properties: { key: pin.key },
      geometry: {
        type: "LineString",
        coordinates: flightArc(pin, 64).map((point) => [point.longitude, point.latitude]),
      },
    })),
  };
}

export const ROUTE_COLLECTION = routeCollection();

/** Camera box for one published route. Null when the key is not on the website map. */
export function focusBounds(key: string): [number, number, number, number] | null {
  const pin = MAP_DESTINATIONS.find((item) => item.key === key);
  if (!pin) return null;
  const box = arcBounds(flightArc(pin, 64));
  return [box.west, box.south, box.east, box.north];
}

export function pinsForDestinationKeys(keys: string[]) {
  const wanted = new Set(keys);
  return PUBLISHED_PINS.filter((pin) => wanted.has(pin.key));
}

/** Apple Maps directions. Latitude first, matching maps.apple.com. */
export function appleMapsDirectionsUrl(pin: { latitude: number; longitude: number; name: string }) {
  return `https://maps.apple.com/?daddr=${pin.latitude},${pin.longitude}&q=${encodeURIComponent(pin.name)}`;
}
