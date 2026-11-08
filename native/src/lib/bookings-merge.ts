import type { AccountBooking, LocalBooking, TripStatus, TripSummary } from "./types";

const STATUSES = new Set<TripStatus>(["new", "contacted", "confirmed", "paid", "cancelled", "waitlist"]);

export function isTripStatus(value: unknown): value is TripStatus {
  return typeof value === "string" && STATUSES.has(value as TripStatus);
}

export function mergeBookings(local: LocalBooking[], account: AccountBooking[], summaries: TripSummary[]): LocalBooking[] {
  const byId = new Map<string, LocalBooking>();
  for (const booking of local) byId.set(booking.id, { ...booking });
  for (const booking of account) {
    const current = byId.get(booking.id);
    byId.set(booking.id, {
      id: booking.id,
      tourId: booking.tourId,
      tourTitle: current?.tourTitle ?? booking.tourId,
      token: booking.token || current?.token,
      createdAt: booking.createdAt || current?.createdAt || "",
      total: booking.total,
      deposit: booking.deposit,
      date: booking.date ?? current?.date,
      status: current?.status,
      unread: current?.unread,
      paidAmount: current?.paidAmount,
    });
  }
  for (const summary of summaries) {
    const current = byId.get(summary.id);
    if (!current) continue;
    current.status = summary.status;
    current.unread = summary.unread;
    current.paidAmount = summary.paidAmount;
    current.total = summary.total;
  }
  return [...byId.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
