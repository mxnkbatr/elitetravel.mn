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

export type MapPin = (typeof PUBLISHED_PINS)[number];

export function pinsForDestinationKeys(keys: string[]) {
  const wanted = new Set(keys);
  return PUBLISHED_PINS.filter((pin) => wanted.has(pin.key));
}

/** Apple Maps directions. Latitude first, matching maps.apple.com. */
export function appleMapsDirectionsUrl(pin: { latitude: number; longitude: number; name: string }) {
  return `https://maps.apple.com/?daddr=${pin.latitude},${pin.longitude}&q=${encodeURIComponent(pin.name)}`;
}
