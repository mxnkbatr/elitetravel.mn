import type { CatalogPage, ItineraryDay, NewsItem, SeatInfo, SeatMap, Tour, TourPricing } from "./types";

const FLIGHT = 'self.__next_f.push([1,"';

/** Decode the Next.js flight strings the public tour pages already send to browsers. */
export function decodeFlight(html: string) {
  let out = "";
  let idx = 0;
  while (idx < html.length) {
    const at = html.indexOf(FLIGHT, idx);
    if (at < 0) break;
    let j = at + FLIGHT.length;
    let part = "";
    while (j < html.length) {
      const c = html[j];
      if (c === "\\") {
        const n = html[j + 1] ?? "";
        if (n === "n") part += "\n";
        else if (n === "r") part += "\r";
        else if (n === "t") part += "\t";
        else if (n === '"') part += '"';
        else if (n === "\\") part += "\\";
        else if (n === "u") {
          const hex = html.slice(j + 2, j + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) part += String.fromCharCode(parseInt(hex, 16));
          j += 6;
          continue;
        } else part += n;
        j += 2;
        continue;
      }
      if (c === '"') break;
      part += c;
      j += 1;
    }
    out += part;
    idx = j + 1;
  }
  return out;
}

export function matchJsonEnd(text: string, start: number) {
  const open = text[start];
  if (open !== "{" && open !== "[") return null;
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        continue;
      }
      if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === "{" || c === "[") stack.push(c);
    else if (c === "}" || c === "]") {
      stack.pop();
      if (stack.length === 0) return i + 1;
    }
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asStringList(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : undefined;
}

function unresolved(value: unknown) {
  return typeof value === "string" && value.startsWith("$");
}

function asPricing(value: unknown): TourPricing | undefined {
  if (!isRecord(value)) return undefined;
  const pricing: TourPricing = {};
  if (typeof value.child === "string") pricing.child = value.child;
  if (typeof value.childSharedBed === "number") pricing.childSharedBed = value.childSharedBed;
  if (typeof value.childOwnBed === "boolean") pricing.childOwnBed = value.childOwnBed;
  if (typeof value.singleSupplement === "number") pricing.singleSupplement = value.singleSupplement;
  if (typeof value.depositPercent === "number") pricing.depositPercent = value.depositPercent;
  return pricing;
}

function asItinerary(value: unknown): ItineraryDay[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const days: ItineraryDay[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.day !== "string" || typeof item.title !== "string" || typeof item.detail !== "string") return undefined;
    days.push({
      day: item.day,
      title: item.title,
      detail: item.detail,
      flight: asString(item.flight),
      meals: asString(item.meals),
      hotel: asString(item.hotel),
      host: asString(item.host),
    });
  }
  return days;
}

export function asTour(value: unknown): Tour | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || !/^[a-z0-9-]{2,60}$/.test(value.id)) return null;
  if (typeof value.title !== "string" || typeof value.destination !== "string" || typeof value.image !== "string") return null;
  if (!("price" in value) || (value.price !== null && typeof value.price !== "number")) return null;
  const tour: Tour = {
    id: value.id,
    title: value.title,
    destination: value.destination,
    image: value.image,
    price: value.price,
  };
  const destinationKey = asString(value.destinationKey);
  const description = asString(value.description);
  const story = asString(value.story);
  const duration = asString(value.duration);
  const dates = asString(value.dates);
  const stay = asString(value.stay);
  const departure = asString(value.departure);
  const tag = asString(value.tag);
  const status = asString(value.status);
  const discount = asString(value.discount);
  if (destinationKey) tour.destinationKey = destinationKey;
  if (description) tour.description = description;
  if (story) tour.story = story;
  if (duration) tour.duration = duration;
  if (dates) tour.dates = dates;
  if (stay) tour.stay = stay;
  if (departure) tour.departure = departure;
  if (tag) tour.tag = tag;
  if (status) tour.status = status;
  if (discount) tour.discount = discount;
  if (typeof value.nights === "number" || value.nights === null) tour.nights = value.nights;
  if (typeof value.oldPrice === "number" || value.oldPrice === null) tour.oldPrice = value.oldPrice;
  const highlights = asStringList(value.highlights);
  const gallery = asStringList(value.gallery);
  const includes = asStringList(value.includes);
  const excludes = asStringList(value.excludes);
  const notes = asStringList(value.notes);
  const itinerary = asItinerary(value.itinerary);
  const pricing = asPricing(value.pricing);
  if (highlights) tour.highlights = highlights;
  if (gallery) tour.gallery = gallery;
  if (includes) tour.includes = includes;
  if (excludes) tour.excludes = excludes;
  if (notes) tour.notes = notes;
  if (itinerary) tour.itinerary = itinerary;
  if (pricing) tour.pricing = pricing;
  return tour;
}

function asNews(value: unknown): NewsItem | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.title !== "string" || typeof value.excerpt !== "string") return null;
  if (typeof value.category !== "string" || typeof value.image !== "string" || !Array.isArray(value.body)) return null;
  if (!value.body.every((part) => typeof part === "string")) return null;
  const item: NewsItem = { id: value.id, title: value.title, excerpt: value.excerpt, category: value.category, image: value.image, body: value.body };
  if (typeof value.tourId === "string") item.tourId = value.tourId;
  if (typeof value.readMin === "number") item.readMin = value.readMin;
  return item;
}

function richness(tour: Tour) {
  return (tour.itinerary?.length ?? 0) * 10 + (tour.gallery?.length ?? 0) + (tour.includes?.length ?? 0) + (tour.highlights?.length ?? 0) + (tour.story ? 2 : 0) + (tour.pricing ? 2 : 0);
}

function mergeTour(current: Tour | undefined, next: Tour) {
  if (!current) return next;
  const [base, extra] = richness(current) >= richness(next) ? [current, next] : [next, current];
  const merged: Tour = { ...base };
  (Object.keys(extra) as (keyof Tour)[]).forEach((key) => {
    const value = extra[key];
    if (value == null || unresolved(value)) return;
    if (Array.isArray(value) && value.length === 0 && Array.isArray(merged[key]) && (merged[key] as unknown[]).length > 0) return;
    Object.assign(merged, { [key]: value });
  });
  return merged;
}

export function parseSeats(blob: string): SeatMap {
  const key = '"seats":';
  const at = blob.indexOf(key);
  if (at < 0) return {};
  let i = at + key.length;
  while (blob[i] === " ") i += 1;
  if (blob[i] !== "{") return {};
  const end = matchJsonEnd(blob, i);
  if (end == null) return {};
  try {
    const value = JSON.parse(blob.slice(i, end)) as unknown;
    if (!isRecord(value)) return {};
    const seats: SeatMap = {};
    for (const [tourId, dates] of Object.entries(value)) {
      if (!isRecord(dates)) continue;
      const row: Record<string, SeatInfo> = {};
      for (const [label, info] of Object.entries(dates)) {
        if (!isRecord(info) || typeof info.left !== "number" || typeof info.closed !== "boolean") continue;
        row[label] = { left: info.left, closed: info.closed };
      }
      if (Object.keys(row).length) seats[tourId] = row;
    }
    return seats;
  } catch {
    return {};
  }
}

export function scanObjects(blob: string) {
  const found: unknown[] = [];
  const token = '{"id":';
  let i = 0;
  while (i < blob.length) {
    const at = blob.indexOf(token, i);
    if (at < 0) break;
    const end = matchJsonEnd(blob, at);
    if (end == null) {
      i = at + token.length;
      continue;
    }
    try {
      found.push(JSON.parse(blob.slice(at, end)));
    } catch {
      /* skip a truncated flight chunk */
    }
    i = end;
  }
  return found;
}

export function parsePublicPage(html: string): CatalogPage {
  const blob = decodeFlight(html);
  const objects = scanObjects(blob);
  const order: string[] = [];
  const tours = new Map<string, Tour>();
  const news: NewsItem[] = [];
  const seenNews = new Set<string>();
  for (const object of objects) {
    const tour = asTour(object);
    if (tour) {
      if (!tours.has(tour.id)) order.push(tour.id);
      tours.set(tour.id, mergeTour(tours.get(tour.id), tour));
      continue;
    }
    const item = asNews(object);
    if (item && !seenNews.has(item.id)) {
      seenNews.add(item.id);
      news.push(item);
    }
  }
  return { tours: order.map((id) => tours.get(id)!), news, seats: parseSeats(blob) };
}

export async function loadPublicCatalog(origin: string, fetchImpl: typeof fetch = fetch): Promise<CatalogPage> {
  const res = await fetchImpl(`${origin}/tours`, { headers: { Accept: "text/html" } });
  if (!res.ok) throw new Error(`Жагсаалт уншигдсангүй (${res.status}).`);
  const page = parsePublicPage(await res.text());
  if (!page.tours.length) throw new Error("Нийтлэгдсэн аялал олдсонгүй. Каталогийн хуудасны бүтэц өөрчлөгдсөн байж болно.");
  return page;
}

export async function loadPublicTour(origin: string, id: string, fetchImpl: typeof fetch = fetch): Promise<Tour> {
  if (!/^[a-z0-9-]{2,60}$/.test(id)) throw new Error("Буруу аялал.");
  const res = await fetchImpl(`${origin}/tours/${encodeURIComponent(id)}`, { headers: { Accept: "text/html" } });
  if (!res.ok) throw new Error(res.status === 404 ? "Аялал олдсонгүй." : `Аялал уншигдсангүй (${res.status}).`);
  const tour = parsePublicPage(await res.text()).tours.find((item) => item.id === id);
  if (!tour) throw new Error("Аялал олдсонгүй.");
  return tour;
}
