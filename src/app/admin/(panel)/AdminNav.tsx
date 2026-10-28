"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Захиалга", icon: "🎫" },
  { href: "/admin/tours", label: "Аялал", icon: "🧭" },
  { href: "/admin/news", label: "Мэдээ", icon: "📰" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 lg:flex-col">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              active ? "bg-white text-[#062a2a]" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span aria-hidden>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
      <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-white/50 hover:text-white lg:flex">
        <span aria-hidden>↗</span>
        Сайт харах
      </a>
    </nav>
  );
}
