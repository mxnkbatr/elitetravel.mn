"use client";

import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle({ lightOnHero = false }: { lightOnHero?: boolean }) {
  const { theme, toggle, ready } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Light mode" : "Dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`relative grid size-10 place-items-center rounded-full border transition ${
        lightOnHero
          ? "border-white/30 bg-white/10 text-white"
          : "border-[var(--line)] bg-bg-elevated text-foam"
      }`}
    >
      {ready ? (
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="text-[0.95rem] leading-none"
          aria-hidden
        >
          {dark ? "☀" : "☾"}
        </motion.span>
      ) : (
        <span className="size-3 rounded-full bg-current opacity-40" />
      )}
    </button>
  );
}
