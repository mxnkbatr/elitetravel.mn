import { tourDates, type Tour } from "@/data/tours";

/**
 * Admin tour form rules, shared by the editor (live checks) and the save action (final gate),
 * so staff see every problem at once in plain Mongolian and a broken tour can never be stored.
 */

export type TourSection = "basic" | "status" | "price" | "dates" | "images" | "text" | "itinerary";

export type TourIssue = {
  section: TourSection;
  /** Stable key so the editor can mark the input red */
  field: string;
  message: string;
  /** Warnings explain a likely mistake but still allow saving */
  warning?: boolean;
};

export const ID_PATTERN = /^[a-z0-9-]{2,60}$/;

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "i", к: "k", л: "l", м: "m",
  н: "n", о: "o", ө: "u", п: "p", р: "r", с: "s", т: "t", у: "u", ү: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "sh", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** «Хайнань 8 хоног» → "khainan-8-khonog": a link-safe ID suggested from the title. */
export function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** "-8%" from the sale and normal price, or undefined when there is no real sale. */
export function discountLabel(price: number | null | undefined, oldPrice: number | null | undefined) {
  if (price == null || oldPrice == null || oldPrice <= price || oldPrice <= 0) return undefined;
  return `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
}

/** Public state of the tour, as the site decides it (see isBookable). */
export type TourState = "open" | "soon" | "ended";
export const tourState = (t: Pick<Tour, "tag" | "status">): TourState => (t.status === "ended" ? "ended" : t.tag === "soon" ? "soon" : "open");

const blank = (s: string | undefined | null) => !s || !s.trim();
const fmt = (n: number) => `₮${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;

export function validateTour(t: Tour, opts: { now?: number } = {}): TourIssue[] {
  const issues: TourIssue[] = [];
  const add = (section: TourSection, field: string, message: string, warning = false) => issues.push({ section, field, message, warning });
  const state = tourState(t);

  // Basic
  if (blank(t.title)) add("basic", "title", "Аяллын нэрийг бичнэ үү.");
  else if (t.title.length > 200) add("basic", "title", "Аяллын нэр 200 тэмдэгтээс богино байх ёстой.");
  if (blank(t.id)) add("basic", "id", "Холбоос (ID) хоосон байна — аяллын нэрийг бичихэд автоматаар үүснэ.");
  else if (!ID_PATTERN.test(t.id)) add("basic", "id", "Холбоос (ID) зөвхөн жижиг латин үсэг, тоо, зураас (-) агуулж, 2–60 тэмдэгт байна.");
  if (blank(t.destinationKey) || !/^[a-z0-9-]{2,40}$/.test(t.destinationKey)) add("basic", "destinationKey", "Чиглэлийн бүсийг сонгоно уу (эсвэл латинаар бичнэ үү).");
  if (blank(t.destination)) add("basic", "destination", "Чиглэлийн харагдах нэрийг бичнэ үү. Жишээ: Хайнань, Хятад");
  if (blank(t.duration)) add("basic", "duration", "Хугацааг бичнэ үү. Жишээ: 8 өдөр 7 шөнө");
  if (t.nights != null && (!Number.isInteger(t.nights) || t.nights < 0 || t.nights > 60)) add("basic", "nights", "Шөнийн тоо 0–60 хооронд бүхэл тоо байна.");

  // Price
  const price = t.price;
  const labels = tourDates(t);
  const datePrices = t.datePrices ?? {};
  const allDatesPriced = labels.length > 0 && labels.every((l) => datePrices[l]?.price != null);
  if (price != null && price <= 0) add("price", "price", "Үндсэн үнэ 0-ээс их байх ёстой.");
  if (state === "open" && price == null && !allDatesPriced)
    add("price", "price", "Захиалга авч буй аялалд үнэ заавал хэрэгтэй. Үнэ хараахан тодорхойгүй бол төлөвийг «Удахгүй» болгоно уу.");
  if (t.oldPrice != null) {
    if (price == null) add("price", "oldPrice", "Хямдралын өмнөх үнэтэй бол үндсэн (хямдралтай) үнийг бас бичнэ үү.");
    else if (t.oldPrice <= price) add("price", "oldPrice", `Хямдралын өмнөх үнэ (${fmt(t.oldPrice)}) одоогийн үнээс (${fmt(price)}) их байх ёстой.`);
  }
  if (t.pricing?.saleEndsAt) {
    const ends = Date.parse(t.pricing.saleEndsAt);
    if (!Number.isFinite(ends)) add("price", "saleEndsAt", "Хямдрал дуусах огноо буруу байна.");
    else if (ends < (opts.now ?? Date.now())) add("price", "saleEndsAt", "Хямдрал дуусах огноо өнгөрсөн байна — сайт дээр хуучин үнээр харагдана.", true);
    if (t.oldPrice == null && !Object.values(datePrices).some((d) => d.oldPrice != null))
      add("price", "saleEndsAt", "Хямдрал дуусах огноо байгаа ч хямдралын өмнөх үнэ алга.", true);
  }
  if (t.tag === "sale" && t.oldPrice == null && !Object.values(datePrices).some((d) => d.oldPrice != null))
    add("price", "oldPrice", "«Хямдрал» шошготой бол хямдралын өмнөх үнийг бичнэ үү.");

  const child = t.pricing?.childSharedBed;
  if (child != null && price != null && child > price) add("price", "childSharedBed", "Хүүхдийн үнэ том хүний үнээс их байж болохгүй.");
  const calc = t.calculator ?? {};
  if (calc.childBasePrice != null && price != null && calc.childBasePrice > Math.max(price, t.oldPrice ?? 0))
    add("price", "childBasePrice", "Хүүхдийн тогтмол үнэ том хүний үнээс их байна.", true);
  if (calc.childSalePrice != null) {
    if (calc.childBasePrice == null) add("price", "childSalePrice", "Хүүхдийн хямдралтай үнэтэй бол энгийн үнийг нь бас бичнэ үү.");
    else if (calc.childSalePrice > calc.childBasePrice) add("price", "childSalePrice", "Хүүхдийн хямдралтай үнэ энгийн үнээсээ бага байх ёстой.");
  }
  const deposit = calc.depositPercent ?? t.pricing?.depositPercent;
  if (deposit != null && (deposit < 0 || deposit > 100)) add("price", "depositPercent", "Урьдчилгаа 0–100% хооронд байна.");
  const single = calc.singleSupplement ?? t.pricing?.singleSupplement;
  if (single != null && price != null && single > price * 2) add("price", "singleSupplement", "Ганц өрөөний нэмэгдэл хэт өндөр байна — дүнгээ шалгана уу.", true);

  // Dates
  if (state === "open" && labels.length === 0) add("dates", "dates", "Хөдлөх огноо алга — аялагч захиалахдаа огноо сонгож чадахгүй.", true);
  if (labels.length > 12) add("dates", "dates", "12-оос олон хөдлөх огноо оруулах боломжгүй.");
  if (new Set(labels).size !== labels.length) add("dates", "dates", "Ижил огноо давхар орсон байна.");
  for (const label of labels) {
    const d = datePrices[label];
    if (!d) continue;
    if (d.price <= 0) add("dates", `date:${label}`, `${label}: том хүний үнэ 0-ээс их байх ёстой.`);
    if (d.oldPrice != null && d.oldPrice <= d.price) add("dates", `date:${label}`, `${label}: хямдралын өмнөх үнэ одоогийн үнээс их байх ёстой.`);
    if (d.childSharedBed != null && d.childSharedBed > d.price) add("dates", `date:${label}`, `${label}: хүүхдийн үнэ том хүний үнээс их байна.`);
  }

  // Images
  if (blank(t.image)) add("images", "image", "Нүүр зураг оруулна уу — «Зураг оруулах» товч дарна.");
  else if (!/^https:\/\//.test(t.image)) add("images", "image", "Нүүр зургийн холбоос https:// -ээр эхлэх ёстой.");

  // Text
  if (blank(t.description)) add("text", "description", "Товч тайлбар бичнэ үү (картан дээр харагдана).");
  else if (t.description.length > 600) add("text", "description", `Товч тайлбар хэт урт байна (${t.description.length}/600).`);
  if (blank(t.story)) add("text", "story", "Дэлгэрэнгүй тайлбар бичнэ үү (аяллын хуудсанд харагдана).");
  if (state === "open" && t.includes.length === 0) add("text", "includes", "«Үнэд багтсан» хоосон байна — аялагч юу авахаа мэдэхгүй.", true);

  // Itinerary
  t.itinerary.forEach((d, i) => {
    if (blank(d.day) || blank(d.title) || blank(d.detail)) add("itinerary", `day:${i}`, `Хөтөлбөрийн ${i + 1}-р өдөр: өдөр, гарчиг, тайлбар гурвыг бөглөнө үү (эсвэл устгана уу).`);
  });

  return issues;
}

export const blockingIssues = (issues: TourIssue[]) => issues.filter((i) => !i.warning);

/**
 * On opening the editor: older tours keep some rules only in `calculator`. Copy them into the
 * single form fields so saving (which derives the calculator from `pricing`) changes nothing.
 */
export function tourForEditing(t: Tour): Tour {
  const c = t.calculator ?? {};
  const pricing = { ...(t.pricing ?? {}) };
  if (pricing.childSharedBed == null && c.childDiscount != null && t.price != null) pricing.childSharedBed = Math.max(0, t.price - c.childDiscount);
  if (pricing.singleSupplement == null && c.singleSupplement != null) pricing.singleSupplement = c.singleSupplement;
  if (pricing.depositPercent == null && c.depositPercent != null) pricing.depositPercent = c.depositPercent;
  if (c.allowChildExtraBed === false) pricing.childOwnBed = false;
  return { ...t, pricing };
}

/**
 * Before saving: one source of truth for child / single-room / deposit rules. The form edits
 * `pricing`; the calculator copy is derived from it so the page and calculator always agree.
 */
export function normalizeTourForSave(t: Tour): Tour {
  const pricing = { ...(t.pricing ?? {}) };
  const calc = { ...(t.calculator ?? {}) };
  // Calculator copies follow the single form fields
  if (pricing.singleSupplement != null) calc.singleSupplement = pricing.singleSupplement;
  else delete calc.singleSupplement;
  if (pricing.depositPercent != null) calc.depositPercent = pricing.depositPercent;
  else delete calc.depositPercent;
  calc.allowChildExtraBed = pricing.childOwnBed !== false;
  // Per-date child prices only work when the calculator derives the discount itself
  const perDateChild = Object.values(t.datePrices ?? {}).some((d) => d.childSharedBed != null);
  if (pricing.childSharedBed != null && t.price != null && !perDateChild) calc.childDiscount = Math.max(0, t.price - pricing.childSharedBed);
  else delete calc.childDiscount;
  if (calc.childBasePrice == null) delete calc.childSalePrice;

  const hasSale = t.oldPrice != null || Object.values(t.datePrices ?? {}).some((d) => d.oldPrice != null);
  return {
    ...t,
    title: t.title.trim(),
    destination: t.destination.trim(),
    duration: t.duration.trim(),
    discount: discountLabel(t.price, t.oldPrice) ?? (hasSale ? t.discount : undefined),
    tag: t.tag === "sale" && !hasSale ? undefined : t.tag,
    pricing: hasSale ? pricing : { ...pricing, saleEndsAt: undefined },
    calculator: calc,
    oldPrice: t.oldPrice ?? null,
  };
}
