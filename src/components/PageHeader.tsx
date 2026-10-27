"use client";

import { motion } from "framer-motion";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mb-0"
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-4xl md:text-[2.75rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed tracking-[0.01em] text-foam/65 sm:text-base">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
