/**
 * Write room-calculator settings (child discount, single supplement, deposit, extra bed) onto
 * every priced tour in Supabase. The adult price is never stored here — the calculator reads
 * the tour's own price / oldPrice / pricing.saleEndsAt, so page and calculator always match.
 * Usage: node scripts/db-patch-calculator.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const env = Object.fromEntries(
  readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE URL or SERVICE_ROLE_KEY / SUPABASE_SECRET_KEY");
  process.exit(1);
}

const KNOWN = {
  "weeknd-world-tour": { childDiscount: 0, singleSupplement: 1_200_000, allowChildExtraBed: false, depositPercent: 50 },
  "dately-show-hainan": { childDiscount: 300_000, singleSupplement: 700_000, allowChildExtraBed: true, depositPercent: 30 },
  hainan: { childDiscount: 300_000, singleSupplement: 700_000, allowChildExtraBed: true, depositPercent: 30 },
  "hainan-2": { childDiscount: 300_000, singleSupplement: 700_000, allowChildExtraBed: true, depositPercent: 30 },
  "hainan-3": { childDiscount: 300_000, singleSupplement: 700_000, allowChildExtraBed: true, depositPercent: 30 },
  "hainan-4": { childDiscount: 300_000, singleSupplement: 700_000, allowChildExtraBed: true, depositPercent: 30 },
  bali: { childDiscount: 0, singleSupplement: 1_100_000, allowChildExtraBed: true, depositPercent: 50 },
};

function settingsFor(tour) {
  if (KNOWN[tour.id]) return { enabled: tour.calculator?.enabled !== false, ...KNOWN[tour.id] };
  const childShared = tour.pricing?.childSharedBed;
  return {
    enabled: tour.calculator?.enabled !== false,
    childDiscount: childShared != null && tour.price ? Math.max(0, tour.price - childShared) : 0,
    singleSupplement: tour.pricing?.singleSupplement ?? 0,
    allowChildExtraBed: tour.pricing?.childOwnBed !== false,
    depositPercent: tour.pricing?.depositPercent ?? 30,
  };
}

const db = createClient(url, key, { auth: { persistSession: false } });
const { data: rows, error } = await db.from("tours").select("id, data");
if (error) throw error;

let updated = 0;
for (const row of rows ?? []) {
  const tour = { ...(row.data ?? {}), id: row.id };
  if (tour.price == null || tour.price <= 0) {
    console.warn("skip (no price)", row.id);
    continue;
  }
  const calculator = settingsFor(tour);
  const { error: upErr } = await db
    .from("tours")
    .update({ data: { ...tour, calculator }, updated_at: new Date().toISOString() })
    .eq("id", row.id);
  if (upErr) throw upErr;
  updated += 1;
  console.log(
    "patched",
    row.id,
    `· price ${tour.price}${tour.oldPrice ? ` (old ${tour.oldPrice})` : ""}`,
    `· child −${calculator.childDiscount} · single +${calculator.singleSupplement} · ${calculator.depositPercent}%`,
  );
}
console.log(`done · ${updated} tours`);
