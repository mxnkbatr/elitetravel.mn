import "server-only";

import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/** Supabase Auth client bound to the request's cookies (publishable key, acts as the signed-in user). */
export async function supabaseAuth() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing");
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Server Components cannot write cookies; proxy.ts refreshes the session instead
        }
      },
    },
  });
}

/** True when the email is on the admin_users allowlist. */
export async function isAdminEmail(email: string) {
  const db = supabaseAdmin();
  if (!db) return false;
  const { data } = await db.from("admin_users").select("email").eq("email", email.toLowerCase()).maybeSingle();
  return data != null;
}

/** The signed-in staff member, or null. Verified against Supabase Auth on every request. */
export const getAdmin = cache(async () => {
  const supabase = await supabaseAuth();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (!email || !(await isAdminEmail(email))) return null;
  return { email };
});

/** Guards admin pages and every admin Server Action — never trust the proxy alone. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
