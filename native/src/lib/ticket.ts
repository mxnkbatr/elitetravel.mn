import type { TripStatus } from "./types";

/** Arrival airports named in the published itineraries. Haikou Meilan, Hong Kong, Denpasar. */
const AIRPORT: Record<string, { code: string; city: string }> = {
  hainan: { code: "HAK", city: "Хайкоу" },
  hongkong: { code: "HKG", city: "Хонг Конг" },
  bali: { code: "DPS", city: "Денпасар" },
  egypt: { code: "CAI", city: "Каир" },
};

export const ORIGIN = { code: "ULN", city: "Улаанбаатар" };

export function destinationAirport(key?: string) {
  if (key && AIRPORT[key]) return AIRPORT[key];
  return { code: "—", city: "" };
}

export function travellersLabel(count?: number | null) {
  if (count == null || count <= 0) return "—";
  return `${count} зорчигч`;
}

/** First concrete calendar day in a booking or tour date string. Open-ended copy stays null. */
export function parseDeparture(raw: string | undefined, now = new Date()): Date | null {
  if (!raw) return null;
  const iso = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const slash = raw.match(/(\d{1,2})\/(\d{1,2})/);
  if (!slash) return null;
  const month = Number(slash[1]);
  const day = Number(slash[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const year = now.getFullYear();
  const candidate = new Date(year, month - 1, day);
  if (candidate.getTime() < now.getTime() - 24 * 60 * 60 * 1000) candidate.setFullYear(year + 1);
  return candidate;
}

export function countdownLabel(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "Ниссэн";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const clock = [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  return days > 0 ? `${days} өдөр ${clock}` : clock;
}

export function statusLine(status?: TripStatus) {
  if (status === "waitlist") return "Хүлээлэг";
  if (status === "confirmed") return "Баталгаажсан";
  if (status === "paid") return "Баталгаажсан";
  if (status === "contacted") return "Холбогдсон";
  if (status === "cancelled") return "Цуцалсан";
  if (status === "new") return "Шинэ хүсэлт";
  return "Хүсэлт";
}
