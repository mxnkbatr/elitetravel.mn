import { formatPrice, type TourCalculatorConfig, type TourSummary } from "@/data/tours";

export type { TourCalculatorConfig };

export type PairChoice = "double" | "twin" | "twoSingles";
export type OddChoice = "single" | "shared" | "withChild";

export type RoomKids = {
  extraBed: boolean;
  withParents: number;
};

export type CalculatorState = {
  adults: number;
  children: number;
  pairRooms: { choice: PairChoice | null; kids: RoomKids }[];
  oddRoom: { choice: OddChoice | null; kids: RoomKids } | null;
  expandedPairs: boolean[];
};

/** Live adult price for the chosen departure (same number the page shows). */
export type Rates = {
  price: number | null;
  oldPrice: number | null;
  childSharedBed?: number;
  saleActive: boolean;
  saleEndsAt: string | null;
};

export type ResolvedCalculator = {
  enabled: boolean;
  childDiscount: number;
  childBasePrice: number | null;
  childSalePrice: number | null;
  singleSupplement: number;
  allowChildExtraBed: boolean;
  depositPercent: number;
};

export type CalculatorQuote = {
  /** Booking may continue: every visible room chosen and totalRemaining === 0 (incl. 1 adult). */
  ready: boolean;
  /** Summary table — requires pairCount > 0 (never for 1 adult). */
  summaryReady: boolean;
  totalRemaining: number;
  remainingAdults: number;
  remainingChildren: number;
  remainingLabel: string;
  adultPrice: number;
  originalPrice: number | null;
  childPrice: number;
  childWithBed: number;
  childNoBed: number;
  oddFee: number;
  pairSinglesFee: number;
  twoSinglesCount: number;
  total: number;
  deposit: number;
  balance: number;
  savings: number;
  perChildDiscount: number;
  lines: { label: string; amount: number }[];
  party: { adults: number; kidsOwnBed: number; kidsSharedBed: number; singleRooms: number };
  roommatePending: boolean;
};

const emptyKids = (): RoomKids => ({ extraBed: false, withParents: 0 });

export function resolveCalculator(
  tour: Pick<TourSummary, "pricing" | "calculator">,
  rates?: Pick<Rates, "price" | "childSharedBed">,
): ResolvedCalculator {
  const c = tour.calculator ?? {};
  const price = rates?.price ?? null;
  const shared = rates?.childSharedBed ?? tour.pricing?.childSharedBed;
  return {
    enabled: c.enabled === true,
    childDiscount:
      c.childDiscount ?? (price != null && shared != null ? Math.max(0, price - shared) : 0),
    childBasePrice: c.childBasePrice ?? null,
    childSalePrice: c.childSalePrice ?? null,
    singleSupplement: c.singleSupplement ?? tour.pricing?.singleSupplement ?? 0,
    allowChildExtraBed: c.allowChildExtraBed ?? tour.pricing?.childOwnBed !== false,
    depositPercent: c.depositPercent ?? tour.pricing?.depositPercent ?? 0,
  };
}

export function pairCountOf(adults: number) {
  return Math.floor(Math.max(1, adults) / 2);
}

export function hasOddOf(adults: number) {
  return Math.max(1, adults) % 2 === 1;
}

export function logicalRoomsOf(adults: number) {
  return pairCountOf(adults) + (hasOddOf(adults) ? 1 : 0);
}

/**
 * Per logical room: 1 extra-bed + 2 no-bed when allowed; Weeknd (no extra bed) → ×2.
 * Intentional fix vs Lovable source which always used ×3 even without extra-bed UI.
 */
export function childrenMaxOf(adults: number, allowChildExtraBed = true) {
  return logicalRoomsOf(adults) * (allowChildExtraBed ? 3 : 2);
}

export function visiblePairs(state: CalculatorState) {
  const n = pairCountOf(state.adults);
  return Array.from({ length: n }, (_, i) => state.pairRooms[i] ?? { choice: null as PairChoice | null, kids: emptyKids() });
}

export function initialCalculatorState(adults = 2): CalculatorState {
  const a = Math.max(1, adults);
  const pairs = pairCountOf(a);
  return {
    adults: a,
    children: 0,
    pairRooms: Array.from({ length: pairs }, () => ({ choice: null, kids: emptyKids() })),
    oddRoom: null,
    expandedPairs: Array.from({ length: pairs }, () => true),
  };
}

function roomKidCount(k: RoomKids) {
  return (k.extraBed ? 1 : 0) + k.withParents;
}

function clampKids(kids: RoomKids, allowExtra: boolean): RoomKids {
  return {
    extraBed: allowExtra && kids.extraBed,
    withParents: Math.max(0, Math.min(2, Math.floor(kids.withParents) || 0)),
  };
}

/** Only visible groups count — hidden odd/pair slots must not affect price or remaining. */
function activeOdd(state: CalculatorState) {
  return hasOddOf(state.adults) ? state.oddRoom : null;
}

function placedChildren(state: CalculatorState) {
  let n = visiblePairs(state).reduce((s, r) => (r.choice != null ? s + roomKidCount(r.kids) : s), 0);
  const odd = activeOdd(state);
  if (odd?.choice != null) n += roomKidCount(odd.kids);
  return n;
}

export function totalAllocated(state: CalculatorState) {
  let n = visiblePairs(state).reduce((s, r) => s + (r.choice != null ? 2 + roomKidCount(r.kids) : 0), 0);
  const odd = activeOdd(state);
  if (odd?.choice != null) n += 1 + roomKidCount(odd.kids);
  return n;
}

export function trimChildren(state: CalculatorState): CalculatorState {
  let excess = placedChildren(state) - state.children;
  if (excess <= 0) return state;
  const next: CalculatorState = {
    ...state,
    pairRooms: state.pairRooms.map((r) => ({ ...r, kids: { ...r.kids } })),
    oddRoom: state.oddRoom ? { ...state.oddRoom, kids: { ...state.oddRoom.kids } } : null,
  };
  const removeFrom = (kids: RoomKids) => {
    while (excess > 0 && kids.withParents > 0) {
      kids.withParents -= 1;
      excess -= 1;
    }
    if (excess > 0 && kids.extraBed) {
      kids.extraBed = false;
      excess -= 1;
    }
  };
  if (hasOddOf(next.adults) && next.oddRoom) removeFrom(next.oddRoom.kids);
  for (let i = Math.min(next.pairRooms.length, pairCountOf(next.adults)) - 1; i >= 0 && excess > 0; i--) {
    removeFrom(next.pairRooms[i].kids);
  }
  return next;
}

export function setAdults(state: CalculatorState, adults: number, allowChildExtraBed = true): CalculatorState {
  const a = Math.max(1, Math.floor(adults));
  const pairs = pairCountOf(a);
  const pairRooms = state.pairRooms.slice(0, pairs).map((r) => ({ ...r, kids: { ...r.kids } }));
  while (pairRooms.length < pairs) pairRooms.push({ choice: null, kids: emptyKids() });
  let expandedPairs = state.expandedPairs.slice(0, pairs);
  while (expandedPairs.length < pairs) expandedPairs.push(true);
  const oddRoom = hasOddOf(a) ? state.oddRoom : null;
  const children = Math.min(state.children, childrenMaxOf(a, allowChildExtraBed));
  return trimChildren({ adults: a, children, pairRooms, oddRoom, expandedPairs });
}

export function setChildren(state: CalculatorState, children: number, allowChildExtraBed = true): CalculatorState {
  const c = Math.max(0, Math.min(childrenMaxOf(state.adults, allowChildExtraBed), Math.floor(children)));
  return trimChildren({ ...state, children: c });
}

export function setOddChoice(state: CalculatorState, choice: OddChoice): CalculatorState {
  if (!hasOddOf(state.adults)) return state;
  const odd = state.oddRoom ?? { choice: null, kids: emptyKids() };
  if (odd.choice === choice) return { ...state, oddRoom: null };
  return { ...state, oddRoom: { choice, kids: odd.choice == null ? emptyKids() : { ...odd.kids } } };
}

export function setPairChoice(state: CalculatorState, index: number, choice: PairChoice): CalculatorState {
  const pairRooms = [...state.pairRooms];
  while (pairRooms.length <= index) pairRooms.push({ choice: null, kids: emptyKids() });
  const cur = pairRooms[index];
  pairRooms[index] = cur.choice === choice ? { choice: null, kids: emptyKids() } : { ...cur, choice };
  return { ...state, pairRooms };
}

export function setPairKids(
  state: CalculatorState,
  index: number,
  kids: RoomKids,
  allowChildExtraBed = true,
): CalculatorState {
  const pairRooms = [...state.pairRooms];
  while (pairRooms.length <= index) pairRooms.push({ choice: null, kids: emptyKids() });
  pairRooms[index] = { ...pairRooms[index], kids: clampKids(kids, allowChildExtraBed) };
  return trimChildren({ ...state, pairRooms });
}

export function setOddKids(state: CalculatorState, kids: RoomKids, allowChildExtraBed = true): CalculatorState {
  if (!hasOddOf(state.adults) || !state.oddRoom?.choice) return state;
  return trimChildren({ ...state, oddRoom: { ...state.oddRoom, kids: clampKids(kids, allowChildExtraBed) } });
}

export function togglePairExpanded(state: CalculatorState, index: number): CalculatorState {
  const expandedPairs = [...state.expandedPairs];
  while (expandedPairs.length <= index) expandedPairs.push(true);
  expandedPairs[index] = !(expandedPairs[index] ?? true);
  return { ...state, expandedPairs };
}

export function assignedChildrenCount(state: CalculatorState) {
  return placedChildren(state);
}

export function canAddMoreChildren(state: CalculatorState) {
  return assignedChildrenCount(state) < state.children;
}

function remainingLabelMn(a: number, c: number) {
  const parts: string[] = [];
  if (a === 1) parts.push("1 том хүн");
  else if (a > 1) parts.push(`${a} том хүн`);
  if (c === 1) parts.push("1 хүүхэд");
  else if (c > 1) parts.push(`${c} хүүхэд`);
  return parts.length ? `${parts.join(" ")} үлдсэн` : "";
}

export function childUnitPrice(
  settings: ResolvedCalculator,
  adultPrice: number,
  adults: number,
  childrenInput: number,
  saleActive: boolean,
) {
  let price: number;
  if (settings.childBasePrice != null) {
    price = saleActive && settings.childSalePrice != null ? settings.childSalePrice : settings.childBasePrice;
  } else {
    price = Math.max(0, adultPrice - settings.childDiscount);
  }
  if (adults === 1 && childrenInput === 1) price = adultPrice;
  return price;
}

/**
 * TOTAL = (A + B) × P + N × C + oddSingleFee + twoSinglesFee
 * Adults always priced; only allocated children in visible groups contribute.
 */
export function calculateTourPrice(
  tour: Pick<TourSummary, "pricing" | "calculator">,
  state: CalculatorState,
  rates: Rates,
): CalculatorQuote {
  const settings = resolveCalculator(tour, rates);
  const adultPrice = rates.price ?? 0;
  const originalPrice = rates.saleActive && rates.oldPrice != null && rates.oldPrice > adultPrice ? rates.oldPrice : null;
  const childPrice = childUnitPrice(settings, adultPrice, state.adults, state.children, rates.saleActive);

  const pairs = visiblePairs(state);
  const pairCount = pairs.length;
  const hasOdd = hasOddOf(state.adults);
  const odd = activeOdd(state);

  let childWithBed = 0;
  let childNoBed = 0;
  for (const r of pairs) {
    if (r.choice == null) continue;
    if (r.kids.extraBed) childWithBed += 1;
    childNoBed += r.kids.withParents;
  }
  if (odd?.choice != null) {
    if (odd.kids.extraBed) childWithBed += 1;
    childNoBed += odd.kids.withParents;
  }

  const allocated = totalAllocated(state);
  const remaining = Math.max(0, state.adults + state.children - allocated);
  const assignedBaseSlots = pairs.filter((r) => r.choice != null).length * 2 + (odd?.choice != null ? 1 : 0);
  const assignedAdults = Math.min(state.adults, assignedBaseSlots);
  const remainingAdults = Math.max(0, state.adults - assignedAdults);
  const remainingChildren = Math.max(0, state.children - (allocated - assignedAdults));

  const twoSinglesCount = pairs.filter((r) => r.choice === "twoSingles").length;
  const pairSinglesFee = twoSinglesCount * 2 * settings.singleSupplement;
  const oddFee = hasOdd && odd?.choice === "single" ? settings.singleSupplement : 0;

  const total = (state.adults + childWithBed) * adultPrice + childNoBed * childPrice + oddFee + pairSinglesFee;
  const deposit = settings.depositPercent > 0 ? Math.round((total * settings.depositPercent) / 100) : 0;

  // Intentional fix vs Lovable: always real savings N × max(0, P − C)
  const perChildDiscount = Math.max(0, adultPrice - childPrice);
  const savings = childNoBed * perChildDiscount;

  const roomsSelected = pairs.every((r) => r.choice != null) && (!hasOdd || odd?.choice != null);
  const ready = roomsSelected && remaining === 0;
  const summaryReady = pairCount > 0 && ready;

  const lines: CalculatorQuote["lines"] = [];
  if (state.adults) lines.push({ label: `${state.adults} том хүн × ${formatPrice(adultPrice)}`, amount: state.adults * adultPrice });
  if (childWithBed) lines.push({ label: `${childWithBed} хүүхэд /нэмэлт ортой/ × ${formatPrice(adultPrice)}`, amount: childWithBed * adultPrice });
  if (childNoBed) lines.push({ label: `${childNoBed} хүүхэд /нэмэлт оргүй/ × ${formatPrice(childPrice)}`, amount: childNoBed * childPrice });
  if (pairSinglesFee) lines.push({ label: `Тус тусдаа ганц өрөө × ${twoSinglesCount}`, amount: pairSinglesFee });
  if (oddFee) lines.push({ label: "Ганц өрөөний нэмэгдэл", amount: oddFee });

  const singleRooms = twoSinglesCount * 2 + (hasOdd && odd?.choice === "single" ? 1 : 0);

  return {
    ready,
    summaryReady,
    totalRemaining: remaining,
    remainingAdults,
    remainingChildren,
    remainingLabel: remainingLabelMn(remainingAdults, remainingChildren),
    adultPrice,
    originalPrice,
    childPrice,
    childWithBed,
    childNoBed,
    oddFee,
    pairSinglesFee,
    twoSinglesCount,
    total,
    deposit,
    balance: total - deposit,
    savings,
    perChildDiscount,
    lines,
    party: { adults: state.adults, kidsOwnBed: childWithBed, kidsSharedBed: childNoBed, singleRooms },
    roommatePending: hasOdd && odd?.choice === "shared",
  };
}

/** Schema + allocation rules for booking/API. Returns Mongolian error or null. */
export function validateCalculatorState(
  state: CalculatorState,
  allowChildExtraBed: boolean,
): string | null {
  if (!Number.isInteger(state.adults) || state.adults < 1) return "Том хүний тоо буруу байна.";
  if (!Number.isInteger(state.children) || state.children < 0) return "Хүүхдийн тоо буруу байна.";
  if (state.children > childrenMaxOf(state.adults, allowChildExtraBed)) return "Хүүхдийн тоо хэтэрсэн байна.";

  const pairs = visiblePairs(state);
  for (const r of pairs) {
    if (r.kids.withParents > 2) return "Нэг өрөөнд хамт унтах хүүхэд 2-оос илүү байж болохгүй.";
    if (r.kids.extraBed && !allowChildExtraBed) return "Энэ аялалд нэмэлт ортой хүүхэд сонгох боломжгүй.";
    if (r.kids.extraBed && roomKidCount(r.kids) > 3) return "Нэг өрөөний хүүхдийн хязгаар хэтэрсэн.";
  }
  const odd = activeOdd(state);
  if (odd) {
    if (odd.kids.withParents > 2) return "Нэг өрөөнд хамт унтах хүүхэд 2-оос илүү байж болохгүй.";
    if (odd.kids.extraBed && !allowChildExtraBed) return "Энэ аялалд нэмэлт ортой хүүхэд сонгох боломжгүй.";
  }
  if (placedChildren(state) > state.children) return "Хуваарилсан хүүхэд нийт тооноос илүү байна.";
  return null;
}

export function calculatorPayload(state: CalculatorState, quote: CalculatorQuote) {
  const pairs = visiblePairs(state);
  const odd = activeOdd(state);
  return {
    adults: state.adults,
    children: state.children,
    pairRooms: pairs.map((r) => ({ choice: r.choice, extraBed: r.kids.extraBed, withParents: r.kids.withParents })),
    oddRoom: odd
      ? { choice: odd.choice, extraBed: odd.kids.extraBed, withParents: odd.kids.withParents }
      : null,
    roomGroups: [
      ...pairs.map((r, i) => ({
        groupId: `pair-${i + 1}`,
        baseAdults: 2,
        type: r.choice,
        physicalRooms: r.choice === "twoSingles" ? 2 : 1,
        extraBedChildren: r.choice && r.kids.extraBed ? 1 : 0,
        noBedChildren: r.choice ? r.kids.withParents : 0,
      })),
      ...(odd
        ? [
            {
              groupId: "odd-1",
              baseAdults: 1,
              type: odd.choice,
              physicalRooms: 1,
              extraBedChildren: odd.choice && odd.kids.extraBed ? 1 : 0,
              noBedChildren: odd.choice ? odd.kids.withParents : 0,
              roommateStatus: odd.choice === "shared" ? "pending_match" : null,
            },
          ]
        : []),
    ],
    childWithBed: quote.childWithBed,
    childNoBed: quote.childNoBed,
    singleRooms: quote.party.singleRooms,
    roommatePending: quote.roommatePending,
    pricingSnapshot: {
      adultPrice: quote.adultPrice,
      childPrice: quote.childPrice,
      lines: quote.lines,
      total: quote.total,
      deposit: quote.deposit,
      balance: quote.balance,
      savings: quote.savings,
      quotedAt: new Date().toISOString(),
    },
    total: quote.total,
    deposit: quote.deposit,
    savings: quote.savings,
  };
}

export function parseCalculatorState(raw: unknown, allowChildExtraBed = true): CalculatorState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Number.isInteger(o.adults) || (o.adults as number) < 1) return null;
  const adults = o.adults as number;
  const maxKids = childrenMaxOf(adults, allowChildExtraBed);
  const children = Number.isInteger(o.children) ? Math.max(0, Math.min(maxKids, o.children as number)) : 0;
  const base = initialCalculatorState(adults);
  base.children = children;

  const pairs = Array.isArray(o.pairRooms) ? o.pairRooms : [];
  base.pairRooms = Array.from({ length: pairCountOf(adults) }, (_, i) => {
    const row = (pairs[i] ?? {}) as Record<string, unknown>;
    const choice = row.choice === "twin" || row.choice === "twoSingles" || row.choice === "double" ? row.choice : null;
    const kids = clampKids(
      {
        extraBed: row.extraBed === true,
        withParents: Math.max(0, Math.min(2, Number(row.withParents ?? 0) || 0)),
      },
      allowChildExtraBed,
    );
    return { choice, kids };
  });

  if (hasOddOf(adults)) {
    const odd = (o.oddRoom ?? null) as Record<string, unknown> | null;
    if (odd) {
      const choice = odd.choice === "single" || odd.choice === "shared" || odd.choice === "withChild" ? odd.choice : null;
      base.oddRoom = {
        choice,
        kids: clampKids(
          {
            extraBed: odd.extraBed === true,
            withParents: Math.max(0, Math.min(2, Number(odd.withParents ?? 0) || 0)),
          },
          allowChildExtraBed,
        ),
      };
    }
  } else {
    base.oddRoom = null;
  }

  return trimChildren(base);
}

export const PAIR_LABEL: Record<PairChoice, string> = {
  double: "Хосын том ортой өрөө",
  twin: "Тусдаа 2 ортой өрөө",
  twoSingles: "Тус тусдаа ганц ганц өрөө",
};

export const ODD_LABEL: Record<OddChoice, string> = {
  shared: "Ижил хүйсийн өөр аялагчтай өрөө хуваалцах",
  withChild: "Хүүхэдтэй хамт нэг өрөөнд байрлах",
  single: "Өрөөнд ганцаараа байрлах",
};
