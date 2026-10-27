import fs from "fs";

fs.writeFileSync(
  "src/components/Navbar.tsx",
  `"use client";

import { filterChipClass } from "@/lib/ui";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/destinations", label: "Чиглэл" },
  { href: "/tours", label: "Аяллууд" },
  { href: "/resorts", label: "Амралт" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/profile", label: "Профайл" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 70],
    ["rgba(12,31,28,0)", "rgba(12,31,28,0.94)"],
  );
  const backdropFilter = useTransform(scrollY, [0, 70], ["blur(0px)", "blur(8px)"]);
  const borderColor = useTransform(
    scrollY,
    [0, 70],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"],
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <motion.header
        style={{ backgroundColor, backdropFilter, borderColor }}
        className="fixed inset-x-0 top-0 z-[60] border-b pt-[env(safe-area-inset-top,0px)]"
      >
        <div className="relative mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/elite-logo.png"
              alt="Elite Travel Mongolia"
              width={44}
              height={44}
              className="size-10 shrink-0 rounded-full object-cover ring-1 ring-white/15 sm:size-11"
              priority
            />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="font-display text-[0.88rem] font-semibold tracking-[0.04em] text-foam">
                Elite Travel Mongolia
              </span>
              <span className="text-[0.65rem] tracking-[0.02em] text-foam/55">
                Explore. Dream. Discover.
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-[#122a26] px-1 py-1 lg:flex">
            {links
              .filter((l) => l.href !== "/profile")
              .map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={\`rounded-full px-3.5 py-2 text-[0.84rem] tracking-[0.01em] transition \${
                      active
                        ? "bg-accent font-semibold text-bg shadow-[0_8px_22px_rgba(94,235,195,0.4)]"
                        : "text-foam/60 hover:bg-white/[0.06] hover:text-foam"
                    }\`}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/tours"
              className={\`hidden md:inline-flex lg:hidden \${filterChipClass(pathname.startsWith("/tours"))}\`}
            >
              Аяллууд
            </Link>

            <Link
              href="/profile"
              className="overflow-hidden rounded-full ring-1 ring-white/25"
              aria-label="Профайл"
            >
              <Image
                src="/elite-logo.png"
                alt="Профайл"
                width={36}
                height={36}
                className="size-9 object-cover sm:size-10"
              />
            </Link>

            <button
              type="button"
              aria-label={open ? "Цэс хаах" : "Цэс"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#122a26] lg:hidden"
            >
              <span className="flex w-3.5 flex-col gap-[3.5px]">
                <span
                  className={\`h-[1.5px] rounded-full bg-foam transition \${open ? "translate-y-[5px] rotate-45" : ""}\`}
                />
                <span
                  className={\`h-[1.5px] rounded-full bg-foam transition \${open ? "opacity-0" : ""}\`}
                />
                <span
                  className={\`h-[1.5px] rounded-full bg-foam transition \${open ? "-translate-y-[5px] -rotate-45" : ""}\`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[55] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Цэс хаах"
              className="absolute inset-0 bg-black/45"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-[calc(4.5rem+env(safe-area-inset-top,0px))] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#122a26] shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
            >
              <div className="border-b border-white/8 px-4 py-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  Menu
                </p>
                <p className="mt-0.5 text-sm text-foam/55">Elite Travel Mongolia</p>
              </div>

              <nav className="py-1">
                {links.map((link, i) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <div key={link.href}>
                      {i > 0 ? <div className="mx-4 h-px bg-white/8" /> : null}
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={\`flex items-center justify-between px-4 py-3.5 text-[0.95rem] tracking-[0.01em] active:bg-white/[0.04] \${
                          active ? "font-semibold text-accent" : "text-foam/90"
                        }\`}
                      >
                        <span>{link.label}</span>
                        {active ? (
                          <span className="grid size-6 place-items-center rounded-full bg-accent/15 text-[0.7rem] text-accent">
                            ✓
                          </span>
                        ) : (
                          <span className="text-foam/25">›</span>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <div className="border-t border-white/8 p-3">
                <a
                  href="tel:+97690031771"
                  className="flex h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg shadow-[0_8px_22px_rgba(94,235,195,0.35)] active:scale-[0.98]"
                >
                  Холбогдох
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
`,
  "utf8",
);

console.log("ios menu ok");
