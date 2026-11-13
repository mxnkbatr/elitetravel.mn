"use client";

import { priceForDate, type Tour } from "@/data/tours";
import { useEffect, useMemo, useState } from "react";

/**
 * Ticks every second until `endsAt`. First render assumes the sale is still on so server and
 * client markup match; the effect corrects it immediately after mount.
 */
export function useSaleActive(endsAt?: string | null): boolean {
  const [active, setActive] = useState(Boolean(endsAt));
  useEffect(() => {
    if (!endsAt) return;
    const ends = new Date(endsAt).getTime();
    const check = () => setActive(ends > Date.now());
    check();
    if (ends <= Date.now()) return;
    const id = window.setInterval(check, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);
  return endsAt ? active : true;
}

/** Live prices for a departure — the same numbers the booking card and calculator show. */
export function useLiveRates(tour: Pick<Tour, "price" | "oldPrice" | "pricing" | "datePrices">, date?: string | null) {
  const running = useSaleActive(tour.pricing?.saleEndsAt);
  return useMemo(() => priceForDate(tour, date, running), [tour, date, running]);
}
