"use server";

import { isAdminEmail, supabaseAuth } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Имэйл, нууц үгээ оруулна уу." };

  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Имэйл эсвэл нууц үг буруу байна." };

  if (!(await isAdminEmail(email))) {
    await supabase.auth.signOut();
    return { error: "Энэ бүртгэлд admin эрх олгогдоогүй байна." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
