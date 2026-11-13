import { formatPrice, type TourCalculatorConfig, type TourSummary } from "@/data/tours";

export type { TourCalculatorConfig };

export type RoomType = "double" | "twin" | "single" | "shared";
export type ChildBed = "withParents" | "extraBed";

export type CalculatorState = {
  adults: number;
  children: number;
  rooms: { type: RoomType | null }[];
  /** One entry per child; `room` is an index into `rooms`, null = not placed yet. */
  kids: { room: number | null; bed: ChildBed }[];
};

/** The live prices the page shows for the chosen departure (see `priceForDate`). */
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
  singleSupplement: number;
  allowChildExtraBed: boolean;
  depositPercent: number;
};

export type CalculatorQuote = {
  ready: boolean;
  warnings: string[];
  remaining: number;
  adultPrice: number;
  /** Pre-sale adult price while the sale runs, else null */
  originalPrice: number | null;
  childPrice: number;
  extraBedKids: number;
  noBedKids: number;
  singleRooms: number;
  singleFee: number;
  total: number;
  deposit: number;
  balance: number;
  saleSavings: number;
  childSavings: number;
  savings: number;
  lines: { label: string; amount: number }[];
  /** Mapped onto the legacy booking columns. */
  party: { adults: number; kidsOwnBed: number; kidsSharedBed: number; singleRooms: number };
};

export const MAX_ADULTS = 20;
export const MAX_CHILDREN = 20;
export const MAX_WITH_PARENTS = 2;
export const MAX_EXTRA_BED = 1;

export const ROOM_ADULTS: Record<RoomType, number> = { double: 2, twin: 2, single: 1, shared: 1 };

/** A stranger shares the `shared` room, so children only go where their own adult sleeps. */
export const roomTakesKids = (t: RoomType | null) => t === "double" || t === "twin" || t === "single";

export function resolveCalculator(tour: Pick<TourSummary, "pricing" | "calculator">, rates?: Pick<Rates, "price" | "childSharedBed">): ResolvedCalculator {
  const c = tour.calculator ?? {};
  const price = rates?.price ?? null;
  const shared = rates?.childSharedBed;
  return {
    enabled: c.enabled === true,
    childDiscount: c.childDiscount ?? (price != null && shared != null ? Math.max(0, price - shared) : 0),
    singleSupplement: c.singleSupplement ?? tour.pricing?.singleSupplement ?? 0,
    allowChildExtraBed: c.allowChildExtraBed ?? tour.pricing?.childOwnBed !== false,
    depositPercent: c.depositPercent ?? tour.pricing?.depositPercent ?? 0,
  };
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Math.floor(n)));

export const suggestedRoomCount = (adults: number) => Math.ceil(adults / 2);
export const roomCountRange = (adults: number) => ({ min: suggestedRoomCount(adults), max: adults });

/** One room per two adults (double by default); an odd adult gets an unchosen room. */
export function suggestRooms(adults: number, prev: CalculatorState["rooms"] = []): CalculatorState["rooms"] {
  const pairs = Math.floor(adults / 2);
  const rooms: CalculatorState["rooms"] = [];
  for (let i = 0; i < pairs; i++) {
    const t = prev[i]?.type;
    rooms.push({ type: t === "double" || t === "twin" ? t : "double" });
  }
  if (adults % 2 === 1) {
    const t = prev[pairs]?.type;
    rooms.push({ type: t === "single" || t === "shared" ? t : null });
  }
  return rooms;
}

/**
 * Keep every earlier placement that still fits, then put the rest with their parents first and
 * on an extra bed second. Children that fit nowhere stay unplaced (room: null).
 */
export function placeKids(
  rooms: CalculatorState["rooms"],
  prev: CalculatorState["kids"],
  count: number,
  allowExtra: boolean,
): CalculatorState["kids"] {
  const used = rooms.map(() => ({ withParents: 0, extraBed: 0 }));
  const fits = (room: number, bed: ChildBed) =>
    room >= 0 &&
    room < rooms.length &&
    roomTakesKids(rooms[room].type) &&
    (bed === "withParents" ? used[room].withParents < MAX_WITH_PARENTS : allowExtra && used[room].extraBed < MAX_EXTRA_BED);
  const take = (room: number, bed: ChildBed) => {
    used[room][bed] += 1;
    return { room, bed };
  };

  const out: (CalculatorState["kids"][number] | null)[] = Array.from({ length: count }, (_, i) => {
    const p = prev[i];
    return p && p.room != null && fits(p.room, p.bed) ? take(p.room, p.bed) : null;
  });

  return out.map((k, i) => {
    if (k) return k;
    const wanted = prev[i]?.bed ?? "withParents";
    for (const bed of wanted === "extraBed" ? (["extraBed", "withParents"] as const) : (["withParents", "extraBed"] as const)) {
      for (let r = 0; r < rooms.length; r++) if (fits(r, bed)) return take(r, bed);
    }
    return { room: null, bed: wanted };
  });
}

export function initialCalculatorState(adults = 2, allowExtra = true): CalculatorState {
  const a = clamp(adults, 1, MAX_ADULTS);
  const rooms = suggestRooms(a);
  return { adults: a, children: 0, rooms, kids: placeKids(rooms, [], 0, allowExtra) };
}

/** Changing the party re-suggests rooms and child placement. */
export function setAdults(state: CalculatorState, adults: number, allowExtra: boolean): CalculatorState {
  const a = clamp(adults, 1, MAX_ADULTS);
  const rooms = suggestRooms(a, state.rooms);
  return { ...state, adults: a, rooms, kids: placeKids(rooms, state.kids, state.children, allowExtra) };
}

export function setChildren(state: CalculatorState, children: number, allowExtra: boolean): CalculatorState {
  const c = clamp(children, 0, MAX_CHILDREN);
  return { ...state, children: c, kids: placeKids(state.rooms, state.kids, c, allowExtra) };
}

export function setRoomCount(state: CalculatorState, count: number, allowExtra: boolean): CalculatorState {
  const { min, max } = roomCountRange(state.adults);
  const n = clamp(count, min, max);
  if (n === state.rooms.length) return state;
  const rooms =
    n === suggestedRoomCount(state.adults)
      ? suggestRooms(state.adults, state.rooms)
      : Array.from({ length: n }, (_, i) => state.rooms[i] ?? { type: null });
  return { ...state, rooms, kids: placeKids(rooms, state.kids, state.children, allowExtra) };
}

export function setRoomType(state: CalculatorState, index: number, type: RoomType, allowExtra: boolean): CalculatorState {
  const rooms = state.rooms.map((r, i) => (i === index ? { type } : r));
  return { ...state, rooms, kids: placeKids(rooms, state.kids, state.children, allowExtra) };
}

/** Adults the other rooms already hold — used to grey out room types that would overfill. */
export function otherRoomsAdults(state: CalculatorState, index: number) {
  return state.rooms.reduce((s, r, i) => (i === index || !r.type ? s : s + ROOM_ADULTS[r.type]), 0);
}

function roomUse(state: CalculatorState, room: number, skipKid: number) {
  let withParents = 0;
  let extraBed = 0;
  state.kids.forEach((k, i) => {
    if (i === skipKid || k.room !== room) return;
    if (k.bed === "withParents") withParents += 1;
    else extraBed += 1;
  });
  return { withParents, extraBed };
}

/** Whether child `kid` may move to `room` with `bed` without breaking a room limit. */
export function kidFits(state: CalculatorState, kid: number, room: number, bed: ChildBed, allowExtra: boolean) {
  if (!roomTakesKids(state.rooms[room]?.type ?? null)) return false;
  const use = roomUse(state, room, kid);
  return bed === "withParents" ? use.withParents < MAX_WITH_PARENTS : allowExtra && use.extraBed < MAX_EXTRA_BED;
}

export function setKid(state: CalculatorState, kid: number, room: number, bed: ChildBed, allowExtra: boolean): CalculatorState {
  if (!kidFits(state, kid, room, bed, allowExtra)) return state;
  return { ...state, kids: state.kids.map((k, i) => (i === kid ? { room, bed } : k)) };
}

const ROOM_NAMES: Record<RoomType, string> = {
  double: "Хосын том ортой өрөө",
  twin: "Найзуудын тусдаа 2 ортой өрөө",
  single: "Ганцаараа",
  shared: "Ижил хүйсийн аялагчтай хуваалцах",
};
export const roomName = (t: RoomType) => ROOM_NAMES[t];

export function calculateTourPrice(tour: Pick<TourSummary, "pricing" | "calculator">, state: CalculatorState, rates: Rates): CalculatorQuote {
  const settings = resolveCalculator(tour, rates);
  const adultPrice = rates.price ?? 0;
  const originalPrice = rates.saleActive && rates.oldPrice != null && rates.oldPrice > adultPrice ? rates.oldPrice : null;

  const capacity = state.rooms.reduce((s, r) => s + (r.type ? ROOM_ADULTS[r.type] : 0), 0);
  const unchosen = state.rooms.filter((r) => !r.type).length;
  const placed = state.kids.filter((k) => k.room != null);
  const extraBedKids = placed.filter((k) => k.bed === "extraBed").length;
  const noBedKids = placed.length - extraBedKids;
  const remainingAdults = Math.max(0, state.adults - capacity);
  const spareSeats = Math.max(0, capacity - state.adults);
  const remainingKids = state.children - placed.length;

  const warnings: string[] = [];
  if (unchosen) warnings.push(`${unchosen} өрөөний төрлийг сонгоогүй байна.`);
  if (remainingAdults) warnings.push(`${remainingAdults} том хүн өрөөнд хуваарилагдаагүй байна.`);
  if (spareSeats) warnings.push(`Өрөөнд ${spareSeats} том хүний сул байр байна — өрөөний төрөл эсвэл тоогоо өөрчилнө үү.`);
  if (remainingKids) warnings.push(`${remainingKids} хүүхэд өрөөнд хуваарилагдаагүй байна — өрөө нэмэх эсвэл нэмэлт ор сонгоно уу.`);
  const ready = warnings.length === 0;

  const childPrice = state.adults === 1 && state.children === 1 ? adultPrice : Math.max(0, adultPrice - settings.childDiscount);
  const singleRooms = state.rooms.filter((r) => r.type === "single").length;
  const singleFee = singleRooms * settings.singleSupplement;

  const lines: CalculatorQuote["lines"] = [{ label: `${state.adults} том хүн × ${formatPrice(adultPrice)}`, amount: state.adults * adultPrice }];
  if (extraBedKids) lines.push({ label: `${extraBedKids} хүүхэд, нэмэлт ортой × ${formatPrice(adultPrice)}`, amount: extraBedKids * adultPrice });
  if (noBedKids) lines.push({ label: `${noBedKids} хүүхэд, эцэг эхтэй хамт × ${formatPrice(childPrice)}`, amount: noBedKids * childPrice });
  if (singleFee) lines.push({ label: `Ганц өрөөний нэмэлт × ${singleRooms}`, amount: singleFee });

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const deposit = settings.depositPercent > 0 ? Math.round((total * settings.depositPercent) / 100) : 0;
  const saleSavings = originalPrice != null ? (originalPrice - adultPrice) * (state.adults + extraBedKids + noBedKids) : 0;
  const childSavings = noBedKids * (adultPrice - childPrice);

  return {
    ready,
    warnings,
    remaining: remainingAdults + remainingKids,
    adultPrice,
    originalPrice,
    childPrice,
    extraBedKids,
    noBedKids,
    singleRooms,
    singleFee,
    total,
    deposit,
    balance: total - deposit,
    saleSavings,
    childSavings,
    savings: saleSavings + childSavings,
    lines,
    party: { adults: state.adults, kidsOwnBed: extraBedKids, kidsSharedBed: noBedKids, singleRooms },
  };
}

export function calculatorPayload(state: CalculatorState, quote: CalculatorQuote) {
  return {
    adults: state.adults,
    children: state.children,
    rooms: state.rooms.map((r) => r.type),
    kids: state.kids.map((k) => ({ room: k.room, bed: k.bed })),
    extraBedKids: quote.extraBedKids,
    noBedKids: quote.noBedKids,
    singleRooms: quote.singleRooms,
    total: quote.total,
    deposit: quote.deposit,
    savings: quote.savings,
  };
}

const ROOM_TYPES = new Set<RoomType>(["double", "twin", "single", "shared"]);

/** Server-side: rebuild a valid state from the browser payload (limits re-applied). */
export function parseCalculatorState(raw: unknown, allowExtra: boolean): CalculatorState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const adults = o.adults;
  const children = o.children ?? 0;
  if (!Number.isInteger(adults) || (adults as number) < 1 || (adults as number) > MAX_ADULTS) return null;
  if (!Number.isInteger(children) || (children as number) < 0 || (children as number) > MAX_CHILDREN) return null;
  const a = adults as number;
  const c = children as number;

  const rawRooms = Array.isArray(o.rooms) ? o.rooms : [];
  const { min, max } = roomCountRange(a);
  if (rawRooms.length < min || rawRooms.length > max) return null;
  const rooms = rawRooms.map((t) => ({ type: typeof t === "string" && ROOM_TYPES.has(t as RoomType) ? (t as RoomType) : null }));

  const rawKids = Array.isArray(o.kids) ? o.kids : [];
  const prev = rawKids.slice(0, c).map((k) => {
    const row = (k ?? {}) as Record<string, unknown>;
    return {
      room: Number.isInteger(row.room) ? (row.room as number) : null,
      bed: row.bed === "extraBed" ? ("extraBed" as const) : ("withParents" as const),
    };
  });
  return { adults: a, children: c, rooms, kids: placeKids(rooms, prev, c, allowExtra) };
}
