// Applies supabase/migrations/*.sql in order against DIRECT_URL (session pooler, from .env.local).
//   node scripts/db-migrate.mjs
// Every migration is written to be re-runnable (create ... if not exists).

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import pg from "pg";

const root = path.resolve(import.meta.dirname, "..");
const env = Object.fromEntries(
  readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);
// Migrations need a session connection: DIRECT_URL (session pooler) over the transaction pooler
const url = env.DIRECT_URL || env.DATABASE_URL;
if (!url) throw new Error("DIRECT_URL / DATABASE_URL missing in .env.local");

const dir = path.join(root, "supabase", "migrations");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await client.query(readFileSync(path.join(dir, file), "utf8"));
    console.log(`✓ ${file}`);
  }
  const { rows } = await client.query(
    "select column_name, data_type from information_schema.columns where table_name = 'booking_requests' order by ordinal_position",
  );
  console.log(`booking_requests: ${rows.length} columns`);
  const rls = await client.query("select relrowsecurity from pg_class where relname = 'booking_requests'");
  console.log(`RLS enabled: ${rls.rows[0]?.relrowsecurity}`);
} finally {
  await client.end();
}
