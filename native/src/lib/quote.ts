import { formatPrice } from "./money";
import type { Party, Tour } from "./types";

export type Quote = { lines: { label: string; amount: number }[]; total: number; deposit: number };

/**
 * Same published rules as the website's src/lib/pricing.ts.
 * The booking API recomputes the total; this is only the on-screen estimate.
 */
export function quote(tour: Pick<Tour, "price" | "pricing">, party: Party): Quote {
  const p = tour.pricing ?? {};
  const price = tour.price ?? 0;
  const kidsOwnBed = p.childOwnBed === false ? 0 : party.kidsOwnBed;
  const kidsSharedBed = p.childSharedBed ? party.kidsSharedBed : 0;
  const singleRooms = p.singleSupplement ? Math.min(party.singleRooms, party.adults) : 0;

  const lines: Quote["lines"] = [{ label: `${party.adults} том хүн × ${formatPrice(price)}`, amount: party.adults * price }];
  if (kidsOwnBed) lines.push({ label: `${kidsOwnBed} хүүхэд, тусдаа ор × ${formatPrice(price)}`, amount: kidsOwnBed * price });
  if (kidsSharedBed && p.childSharedBed) lines.push({ label: `${kidsSharedBed} хүүхэд, хамт × ${formatPrice(p.childSharedBed)}`, amount: kidsSharedBed * p.childSharedBed });
  if (singleRooms && p.singleSupplement) lines.push({ label: `Ганцаараа өрөө × ${singleRooms}`, amount: singleRooms * p.singleSupplement });

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  const deposit = p.depositPercent ? Math.round((total * p.depositPercent) / 100) : 0;
  return { lines, total, deposit };
}
