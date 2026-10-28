// Grants /admin access to an email (the account itself is created in Supabase → Authentication → Users).
//   node scripts/admin-add.mjs staff@elitetravel.mn
//   node scripts/admin-add.mjs --remove staff@elitetravel.mn

import { readFileSync } from "node:fs";
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

const args = process.argv.slice(2);
const remove = args.includes("--remove");
const email = args.find((a) => !a.startsWith("--"))?.trim().toLowerCase();
if (!email || !email.includes("@")) throw new Error("Usage: node scripts/admin-add.mjs [--remove] <email>");

const client = new pg.Client({ connectionString: env.DIRECT_URL || env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  if (remove) await client.query("delete from public.admin_users where email = $1", [email]);
  else await client.query("insert into public.admin_users (email) values ($1) on conflict do nothing", [email]);
  const { rows } = await client.query("select email from public.admin_users order by created_at");
  console.log("Admins:", rows.map((r) => r.email).join(", ") || "(none)");
  const auth = await client.query("select 1 from auth.users where lower(email) = $1", [email]);
  if (!remove && !auth.rowCount) console.log(`Note: no Supabase Auth account for ${email} yet — add it under Authentication → Users.`);
} finally {
  await client.end();
}
