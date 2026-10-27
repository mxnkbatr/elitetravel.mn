"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Нүүр", icon: HomeIcon },
  { href: "/destinations", label: "Чиглэл", icon: MapIcon },
  { href: "/tours", label: "Аялал", icon: CompassIcon },
  { href: "/resorts", label: "Амралт", icon: ResortIcon },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 sm:hidden"
      aria-label="Үндсэн цэс"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-md items-stretch justify-between rounded-[1.5rem] border border-white/10 bg-[#10241f] px-1.5 py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
      >
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-h-[3.25rem] min-w-[4.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.15rem] text-[0.66rem] font-medium tracking-[0.02em] transition active:scale-95 ${
                active ? "text-accent" : "text-foam/45"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-[3px] rounded-[1.05rem] bg-accent/12 ring-1 ring-accent/30"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">
                <item.icon active={active} />
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
    </svg>
  );
}

function MapIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
      <path d="M9 4v13.5M15 6.5V20" stroke="currentColor" strokeWidth={active ? 1.85 : 1.5} />
    </svg>
  );
}

function CompassIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth={active ? 1.85 : 1.5} />
      <path
        d="m14.8 9.2-1.6 4.6-4.6 1.6 1.6-4.6 4.6-1.6Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
    </svg>
  );
}

function ResortIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h16M6 20V10l6-4 6 4v10M10 20v-5h4v5"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
      />
      <path d="M12 8.5v.01" stroke="currentColor" strokeWidth={active ? 2.1 : 1.75} strokeLinecap="round" />
    </svg>
  );
}
