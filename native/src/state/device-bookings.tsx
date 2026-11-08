import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { previewMode } from "../lib/config";
import { apiRequest } from "../lib/api";
import { isTripStatus, mergeBookings } from "../lib/bookings-merge";
import type { LocalBooking, TripSummary } from "../lib/types";
import { readJson, writeJson } from "../storage";
import { useSession } from "./session";

const KEY = "elite.bookings";

type DeviceBookings = {
  bookings: LocalBooking[];
  ready: boolean;
  refresh: () => Promise<void>;
  remember: (booking: LocalBooking) => Promise<void>;
};

const Ctx = createContext<DeviceBookings | null>(null);

function isSummaryList(value: unknown): value is TripSummary[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object" && typeof item.id === "string" && isTripStatus(item.status));
}

export function DeviceBookingsProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const [local, setLocal] = useState<LocalBooking[]>([]);
  const [summaries, setSummaries] = useState<TripSummary[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readJson<LocalBooking[]>(KEY).then((stored) => {
      if (stored) setLocal(stored);
      setReady(true);
    });
  }, []);

  const remember = useCallback(async (booking: LocalBooking) => {
    setLocal((current) => {
      const next = [booking, ...current.filter((item) => item.id !== booking.id)];
      void writeJson(KEY, next);
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    const tokens = [...local.map((item) => item.token), ...session.bookings.map((item) => item.token)].filter((token): token is string => !!token);
    const unique = [...new Set(tokens)];
    if (!unique.length || previewMode) return;
    const res = await apiRequest({ path: "/api/trips", json: { tokens: unique } });
    if (isSummaryList(res.body)) setSummaries(res.body);
  }, [local, session.bookings]);

  const bookings = useMemo(() => mergeBookings(local, session.bookings, summaries), [local, session.bookings, summaries]);

  const value = useMemo(() => ({ bookings, ready, refresh, remember }), [bookings, ready, refresh, remember]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDeviceBookings() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useDeviceBookings");
  return value;
}
