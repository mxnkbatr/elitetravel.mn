"use client";

import { EliteLogo } from "@/components/EliteLogo";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/destinations", label: "Чиглэл" },
  { href: "/tours", label: "Аяллууд" },
  { href: "/resorts", label: "Амралт" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/contact", label: "Холбоо" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 40], ["rgba(238,245,242,0)", "rgba(238,245,242,0.96)"]);
  const border = useTransform(
    scrollY,
    [0, 40],
    ["rgba(10,47,43,0)", "rgba(10,47,43,0.1)"],
  );
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 24));
    return () => unsub();
  }, [scrollY]);

  const lightLogo = isHome && !scrolled && !open;

  return (
    <>
      <motion.header
        style={{ backgroundColor: bg, borderColor: border }}
        className="fixed inset-x-0 top-0 z-[60] border-b pt-[env(safe-area-inset-top,0px)]"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <EliteLogo size="md" light={lightLogo} />

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l, i) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.15 }}
                >
                  <Link
                    href={l.href}
                    className={`relative text-[0.84rem] tracking-[0.02em] transition ${
                      active
                        ? "font-semibold text-accent"
                        : lightLogo
                          ? "text-white/80 hover:text-white"
                          : "text-foam/70 hover:text-foam"
                    }`}
                  >
                    {l.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-[#e8b86d] to-accent"
                      />
                    ) : null}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="Цэс"
            className={`grid size-10 place-items-center rounded-full border md:hidden ${
              lightLogo
                ? "border-white/30 bg-white/10 text-white"
                : "border-[var(--line)] bg-bg-elevated text-foam"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex w-3.5 flex-col gap-[3px]">
              <span
                className={`h-px transition ${open ? "translate-y-[4px] rotate-45" : ""} ${
                  lightLogo ? "bg-white" : "bg-foam"
                }`}
              />
              <span
                className={`h-px transition ${open ? "opacity-0" : ""} ${
                  lightLogo ? "bg-white" : "bg-foam"
                }`}
              />
              <span
                className={`h-px transition ${open ? "-translate-y-[4px] -rotate-45" : ""} ${
                  lightLogo ? "bg-white" : "bg-foam"
                }`}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/25"
              aria-label="Хаах"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="absolute inset-x-4 top-[calc(4.75rem+env(safe-area-inset-top))] overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-2 shadow-[var(--shadow)]"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-[0.95rem] text-foam/90"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href="tel:+97690031771"
                className="mt-1 flex h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
              >
                Холбогдох
              </a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
