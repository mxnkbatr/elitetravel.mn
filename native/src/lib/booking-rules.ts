import { tourDates } from "./tours";
import type { Party, Tour } from "./types";

const PHONE = /^[0-9+ ]{8,20}$/;

export type BookingDraft = Party & { name: string; phone: string; date: string; note: string };

function countOk(value: number, min: number) {
  return Number.isInteger(value) && value >= min && value <= 30;
}

/** Client checks that match POST /api/bookings. The server still decides. */
export function bookingError(tour: Pick<Tour, "dates">, draft: BookingDraft) {
  if (draft.name.trim().length < 2) return "Нэрээ оруулна уу.";
  if (draft.name.trim().length > 80) return "Нэр хэт урт байна.";
  if (!PHONE.test(draft.phone.trim())) return "Утасны дугаараа шалгана уу.";
  if (!countOk(draft.adults, 1) || !countOk(draft.kidsOwnBed, 0) || !countOk(draft.kidsSharedBed, 0) || !countOk(draft.singleRooms, 0)) return "Хүний тоо буруу байна.";
  const dates = tourDates(tour);
  if (draft.date && dates.length > 1 && !dates.includes(draft.date)) return "Огноо буруу байна.";
  if (draft.note.length > 500) return "Тэмдэглэл хэт урт байна.";
  return null;
}
