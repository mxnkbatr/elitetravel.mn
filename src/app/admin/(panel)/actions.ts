"use server";

import { requireAdmin } from "@/lib/server/auth";
import { CONTENT_TAG } from "@/lib/server/content";
import { invalidMessage, parseNews, parseTour } from "@/lib/server/content-validate";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { revalidatePath, revalidateTag } from "next/cache";
import { createHash } from "node:crypto";

export type SaveResult = { ok: true } | { ok: false; error: string };

const BOOKING_STATUSES = ["new", "contacted", "confirmed", "paid", "cancelled"] as const;

function db() {
  const client = supabaseAdmin();
  if (!client) throw new Error("Supabase is not configured");
  return client;
}

/** The live site reads tours/news through a tagged cache; expire it so edits show at once. */
function refreshSite() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
}

export async function updateBooking(id: string, patch: { status?: string; staffNote?: string }): Promise<SaveResult> {
  await requireAdmin();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status !== undefined) {
    if (!BOOKING_STATUSES.includes(patch.status as (typeof BOOKING_STATUSES)[number])) return { ok: false, error: "Төлөв буруу." };
    update.status = patch.status;
  }
  if (patch.staffNote !== undefined) update.staff_note = patch.staffNote.trim().slice(0, 1000) || null;
  const { error } = await db().from("booking_requests").update(update).eq("id", id);
  if (error) return { ok: false, error: "Хадгалж чадсангүй." };
  revalidatePath("/admin");
  return { ok: true };
}

type Table = "tours" | "news";

async function save(table: Table, input: unknown, originalId: string | null): Promise<SaveResult> {
  const admin = await requireAdmin();
  let item: { id: string };
  try {
    item = table === "tours" ? parseTour(input) : parseNews(input);
  } catch (e) {
    const message = invalidMessage(e);
    if (message) return { ok: false, error: message };
    throw e;
  }

  const client = db();
  if (originalId === null || originalId !== item.id) {
    const { data: taken } = await client.from(table).select("id").eq("id", item.id).maybeSingle();
    if (taken) return { ok: false, error: `«${item.id}» ID аль хэдийн байна.` };
  }

  const row = { id: item.id, data: item, updated_at: new Date().toISOString(), updated_by: admin.email };
  if (originalId === null) {
    // New items go to the top of the list
    const { data: first } = await client.from(table).select("position").order("position").limit(1).maybeSingle();
    const { error } = await client.from(table).insert({ ...row, position: (first?.position ?? 0) - 1 });
    if (error) return { ok: false, error: "Хадгалж чадсангүй." };
  } else {
    const { error } = await client.from(table).update(row).eq("id", originalId);
    if (error) return { ok: false, error: "Хадгалж чадсангүй." };
  }

  refreshSite();
  revalidatePath(`/admin/${table}`);
  return { ok: true };
}

export async function saveTour(input: unknown, originalId: string | null) {
  return save("tours", input, originalId);
}

export async function saveNews(input: unknown, originalId: string | null) {
  return save("news", input, originalId);
}

export async function deleteItem(table: Table, id: string): Promise<SaveResult> {
  await requireAdmin();
  if (table !== "tours" && table !== "news") return { ok: false, error: "Буруу хүсэлт." };
  const { error } = await db().from(table).delete().eq("id", id);
  if (error) return { ok: false, error: "Устгаж чадсангүй." };
  refreshSite();
  revalidatePath(`/admin/${table}`);
  return { ok: true };
}

/** Saves a new display order: ids top to bottom. */
export async function reorder(table: Table, ids: string[]): Promise<SaveResult> {
  await requireAdmin();
  if (table !== "tours" && table !== "news") return { ok: false, error: "Буруу хүсэлт." };
  const client = db();
  const results = await Promise.all(ids.map((id, position) => client.from(table).update({ position }).eq("id", id)));
  if (results.some((r) => r.error)) return { ok: false, error: "Дараалал хадгалж чадсангүй." };
  refreshSite();
  revalidatePath(`/admin/${table}`);
  return { ok: true };
}

/** Short-lived signature so the browser can upload one image straight to Cloudinary. */
export async function signImageUpload() {
  await requireAdmin();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret) throw new Error("Cloudinary is not configured");
  const folder = "elitetravel/admin";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return { cloudName, apiKey, folder, timestamp, signature };
}
