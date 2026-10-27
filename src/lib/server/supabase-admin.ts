import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Service-role client for server code only (route handlers). Bypasses RLS, so it must
 * never be imported from a client component — `server-only` turns that into a build error.
 * Returns null when the secret key is not configured, so callers can degrade gracefully.
 */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
