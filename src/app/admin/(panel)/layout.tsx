import { AdminNav } from "@/app/admin/(panel)/AdminNav";
import { logout } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/server/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-[#f3f6f5] text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--line)] bg-[#062a2a] px-4 py-3 text-white lg:h-dvh lg:flex-col lg:items-stretch lg:border-b-0 lg:px-4 lg:py-6">
        <div className="flex items-center gap-2.5 lg:mb-8 lg:px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-[#f3e0c2] font-display text-lg font-semibold text-[#062a2a]">E</span>
          <span className="hidden font-display text-lg font-semibold sm:block">Elite Admin</span>
        </div>
        <AdminNav />
        <div className="ml-auto lg:ml-0 lg:mt-auto lg:px-2">
          <p className="hidden truncate text-xs text-white/50 lg:block">{admin.email}</p>
          <form action={logout}>
            <button type="submit" className="mt-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white lg:-mx-2">
              Гарах
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
