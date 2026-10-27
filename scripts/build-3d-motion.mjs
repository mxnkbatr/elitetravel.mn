import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/motion/TiltCard.tsx",
  `"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function TiltCard({ children, className = "", intensity = 14 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), {
    stiffness: 220,
    damping: 22,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), {
    stiffness: 220,
    damping: 22,
  });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate\`radial-gradient(420px circle at \${glareX} \${glareY}, rgba(255,231,168,0.28), transparent 55%)\`;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      className={\`relative will-change-transform \${className}\`}
    >
      <div style={{ transform: "translateZ(28px)", transformStyle: "preserve-3d" }}>{children}</div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
        style={{ background: glare, opacity: 0.9 }}
      />
    </motion.div>
  );
}
`,
);

write(
  "src/components/motion/OrbitField.tsx",
  `"use client";

import { motion } from "framer-motion";

/** Futuristic teal/gold orbital rings — travel palette kept */
export function OrbitField({ className = "" }: { className?: string }) {
  return (
    <div
      className={\`pointer-events-none absolute inset-0 overflow-hidden \${className}\`}
      aria-hidden
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute left-[58%] top-[42%] hidden size-[340px] -translate-x-1/2 -translate-y-1/2 md:block lg:size-[420px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-0 rounded-full border border-[#9af5db]/25"
          style={{ transform: "rotateX(72deg) rotateY(-12deg)" }}
        />
        <div
          className="absolute inset-[10%] rounded-full border border-[#e8a84a]/30"
          style={{ transform: "rotateX(72deg) rotateY(28deg)" }}
        />
        <motion.div
          className="absolute inset-[22%] rounded-full border border-white/15"
          style={{ transform: "rotateX(72deg)" }}
          animate={{ rotateZ: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        {/* satellite dots */}
        {[0, 120, 240].map((deg) => (
          <motion.span
            key={deg}
            className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-[#e8a84a] shadow-[0_0_16px_rgba(232,168,74,0.8)]"
            style={{
              transform: \`rotateZ(\${deg}deg) translateY(-8px) rotateX(72deg)\`,
            }}
          />
        ))}
      </motion.div>

      {/* floating hologram panels */}
      <motion.div
        className="absolute right-[8%] top-[24%] hidden h-28 w-20 rounded-2xl border border-[#9af5db]/30 bg-[#0b6b5c]/15 backdrop-blur-[2px] md:block"
        style={{ transform: "rotateY(-28deg) rotateX(12deg)" }}
        animate={{ y: [0, -16, 0], rotateY: [-28, -18, -28] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="m-2 h-1.5 w-10 rounded-full bg-[#e8a84a]/70" />
        <div className="mx-2 mt-2 space-y-1.5">
          <div className="h-1 w-full rounded-full bg-white/25" />
          <div className="h-1 w-[70%] rounded-full bg-white/20" />
          <div className="h-1 w-[85%] rounded-full bg-white/15" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[28%] right-[18%] hidden size-16 rounded-full border border-[#e8a84a]/40 md:block"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,231,168,0.55), rgba(11,107,92,0.35) 55%, transparent 70%)",
          boxShadow: "0 0 40px rgba(232,168,74,0.25)",
        }}
        animate={{ y: [0, 14, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
`,
);

write(
  "src/components/motion/DestinationOrbit.tsx",
  `"use client";

import { destinations } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const picks = destinations.slice(0, 4);

export function DestinationOrbit() {
  return (
    <section className="relative overflow-hidden py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-end justify-between gap-4"
        >
          <div>
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Live orbit
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              3D чиглэлийн орбит
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-muted sm:block">
            Халуун орны escape — futuristic depth, ижил teal + gold.
          </p>
        </motion.div>

        <div
          className="relative mx-auto flex min-h-[320px] items-center justify-center sm:min-h-[400px]"
          style={{ perspective: 1200 }}
        >
          {/* core glow */}
          <motion.div
            className="absolute size-28 rounded-full sm:size-36"
            style={{
              background:
                "radial-gradient(circle, rgba(232,168,74,0.45), rgba(11,107,92,0.25) 45%, transparent 70%)",
              boxShadow: "0 0 80px rgba(11,107,92,0.25)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="absolute size-20 rounded-full border border-accent/30 sm:size-24" />

          {/* orbit ring */}
          <motion.div
            className="absolute size-[260px] rounded-full border border-dashed border-accent/25 sm:size-[340px]"
            style={{ transform: "rotateX(68deg)" }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute size-[200px] rounded-full border border-[#e8a84a]/20 sm:size-[260px]"
            style={{ transform: "rotateX(68deg)" }}
            animate={{ rotateZ: -360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          />

          {picks.map((d, i) => {
            const angle = (i / picks.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 118;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * 42;
            const y = Math.sin(angle) * 70;
            return (
              <motion.div
                key={d.key}
                className="absolute"
                style={{
                  transformStyle: "preserve-3d",
                  x,
                  y,
                  z,
                }}
                animate={{
                  y: [y - 8, y + 8, y - 8],
                  rotateY: [0, 8, 0],
                }}
                transition={{
                  duration: 4 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                whileHover={{ scale: 1.08, z: z + 40 }}
              >
                <Link href="/destinations" className="block">
                  <div className="group relative size-[88px] overflow-hidden rounded-2xl border border-[var(--line)] bg-bg-elevated shadow-[var(--shadow)] sm:size-[108px]">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                      sizes="108px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                    <p className="absolute inset-x-0 bottom-1.5 px-1.5 text-center text-[0.65rem] font-semibold text-white sm:text-xs">
                      {d.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`,
);

write(
  "src/components/Hero.tsx",
  `"use client";

import { EliteLogo } from "@/components/EliteLogo";
import { OrbitField } from "@/components/motion/OrbitField";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const floaters = [
  { left: "12%", top: "28%", delay: 0, size: 8 },
  { left: "78%", top: "22%", delay: 0.6, size: 12 },
  { left: "64%", top: "58%", delay: 1.1, size: 7 },
  { left: "22%", top: "62%", delay: 1.7, size: 10 },
  { left: "88%", top: "70%", delay: 0.3, size: 6 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const orbitY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#0a2f28]"
    >
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY, scale: imgScale }}>
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Elite Travel destination"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/42 to-black/18" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_30%_40%,rgba(232,168,74,0.22),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-bg via-bg/80 to-transparent" />

      <motion.div className="absolute inset-0 z-[2]" style={{ y: orbitY }}>
        <OrbitField />
      </motion.div>

      {floaters.map((f, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute z-[2] rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: "radial-gradient(circle, rgba(255,230,170,0.95), rgba(232,168,74,0))",
            boxShadow: "0 0 18px rgba(232,168,74,0.45)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.35, 0.95, 0.35], scale: [1, 1.3, 1] }}
          transition={{
            duration: 4.2 + i * 0.35,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-[3] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-24"
      >
        <div className="max-w-xl" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            initial={{ opacity: 0, y: 24, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7"
            style={{ transformPerspective: 800 }}
          >
            <EliteLogo size="hero" light showWordmark />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="epic-rule mb-5 origin-left bg-gradient-to-r from-[#e8a84a] to-[#9af5db]"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/75"
          >
            Warm escapes · Mongolia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36, rotateX: 24 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-[4.25rem]"
            style={{ transformPerspective: 900 }}
          >
            Та манай аяллыг{" "}
            <motion.span
              className="inline-block bg-gradient-to-r from-[#ffe7a8] via-[#9af5db] to-[#ffe7a8] bg-[length:200%_100%] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              хүртэх эрхтэй
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.65 }}
            className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg"
          >
            Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3, rotateX: -6 }}
              whileTap={{ scale: 0.98 }}
              style={{ transformPerspective: 600 }}
            >
              <Link
                href="/tours"
                className="relative inline-flex h-12 items-center overflow-hidden rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(11,107,92,0.45)]"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
                />
                Аяллууд үзэх
              </Link>
            </motion.div>
            <motion.a
              href="tel:+97690031771"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-[2px]"
            >
              +976 9003 1771
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-8 w-5 rounded-full border border-white/40 p-1">
          <motion.div
            className="mx-auto h-1.5 w-1 rounded-full bg-[#e8a84a]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
`,
);

write(
  "src/components/Destinations.tsx",
  `"use client";

import { TiltCard } from "@/components/motion/TiltCard";
import { destinations } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Destinations({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-8 max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Destinations
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-foam sm:text-4xl">
              Аяллын чиглэлүүд
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Хайнань, Хонг Конг, Бали — халуун орны elite escape.
            </p>
          </motion.div>
        ) : null}

        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: 1200 }}
        >
          {destinations.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 48, rotateX: 16 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="rounded-[1.25rem]">
                <Link href="/destinations" className="epic-card group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width:768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#e8a84a]/0 via-transparent to-[#9af5db]/10 opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#ffe7a8]">
                        {d.en}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                        {d.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/75">{d.blurb}</p>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
);

write(
  "src/app/page.tsx",
  `"use client";

import { Destinations } from "@/components/Destinations";
import { Hero } from "@/components/Hero";
import { DestinationOrbit } from "@/components/motion/DestinationOrbit";
import { TiltCard } from "@/components/motion/TiltCard";
import { Section } from "@/components/Section";
import { Tours } from "@/components/Tours";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section className="relative space-y-16 py-14 sm:space-y-20 sm:py-20">
        {/* ambient depth blobs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-[-10%] top-20 size-72 rounded-full bg-[#e8a84a]/10 blur-3xl"
          animate={{ x: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[-8%] top-[40%] size-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ y: [0, -30, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity }}
        />

        <DestinationOrbit />
        <Destinations />
        <Tours limit={6} />

        <div className="mx-auto max-w-6xl px-4 sm:px-6" style={{ perspective: 1000 }}>
          <TiltCard intensity={8} className="rounded-[1.5rem]">
            <motion.div
              initial={{ opacity: 0, y: 36, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[1.5rem] bg-accent px-6 py-10 text-white sm:px-10 sm:py-12"
            >
              <motion.div
                className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#e8a84a]/30 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="pointer-events-none absolute -bottom-20 left-10 size-48 rounded-full bg-[#9af5db]/20 blur-3xl"
                animate={{ scale: [1.1, 0.95, 1.1], x: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              {/* futuristic grid */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                  maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                }}
              />
              <div className="relative">
                <div className="epic-rule mb-5 bg-gradient-to-r from-[#e8a84a] to-white/70" />
                <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  Аяллаа захиалах уу?
                </h2>
                <p className="mt-3 max-w-lg text-white/80">
                  Instagram, Messenger эсвэл утсаар шууд холбогдоорой — Elite Travel зөвлөхүүд тусална.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/contact"
                      className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-accent"
                    >
                      Холбоо барих
                    </Link>
                  </motion.div>
                  <motion.a
                    href="tel:+97690031771"
                    whileHover={{ scale: 1.03 }}
                    className="inline-flex h-11 items-center rounded-full border border-white/40 px-5 text-sm font-medium text-white"
                  >
                    +976 9003 1771
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </Section>
    </>
  );
}
`,
);

// append 3d utilities to globals
const cssPath = path.join(process.cwd(), "src/app/globals.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".scene-3d")) {
  css += `

.scene-3d {
  perspective: 1200px;
  transform-style: preserve-3d;
}

.gpu-3d {
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("ok globals 3d utils");
}

console.log("3d motion done");
