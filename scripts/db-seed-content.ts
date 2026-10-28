// Copies the catalogue in src/data into the tours / news tables. Rows that already exist are
// left alone, so this never overwrites edits made in /admin.
//   npx tsx scripts/db-seed-content.ts

import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { seedNews } from "../src/data/news";
import { seedTours } from "../src/data/tours";

const root = path.resolve(__dirname, "..");
const env = Object.fromEntries(
  readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => [m[1], m[2]]),
);
if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY missing in .env.local");

const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

async function main() {
  for (const [table, items] of [
    ["tours", seedTours],
    ["news", seedNews],
  ] as const) {
    const rows = items.map((item, i) => ({ id: item.id, position: i, data: item, updated_by: "seed" }));
    const { data, error } = await db.from(table).upsert(rows, { onConflict: "id", ignoreDuplicates: true }).select("id");
    if (error) throw error;
    console.log(`${table}: ${data.length} new of ${rows.length}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
