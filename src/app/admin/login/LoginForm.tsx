"use client";

import { login, type LoginState } from "@/app/admin/login/actions";
import { useActionState } from "react";

const field = "h-12 w-full rounded-xl border border-[var(--line)] bg-bg px-4 text-base text-ink outline-none transition focus:border-accent sm:text-sm";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">Имэйл</span>
        <input name="email" type="email" autoComplete="username" required className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-muted">Нууц үг</span>
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {state.error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 w-full rounded-xl bg-ink text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Шалгаж байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
