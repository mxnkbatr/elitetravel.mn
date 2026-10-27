"use client";

import { ShaderBackdrop } from "@/components/ShaderBackdrop";
import { destinations } from "@/data/tours";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";

function DestCard({
  href,
  image,
  en,
  name,
  blurb,
  tall,
  priority,
  delay = 0,
}: {
  href: string;
  image: string;
  en: string;
  name: string;
  blurb: string;
  tall?: boolean;
  priority?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rx = useSpring(rawX, { stiffness: 220, damping: 22 });
  const ry = useSpring(rawY, { stiffness: 220, damping: 22 });
  const glare = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(94,240,208,0.28), transparent 55%)`;

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    const px = (x / r.width) * 2 - 1;
    const py = (y / r.height) * 2 - 1;
    rawY.set(px * 5);
    rawX.set(-py * 5);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      className={tall ? "h-full" : "min-h-0 flex-1"}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
        <Link
          ref={ref}
          href={href}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="dream-glass group relative block h-full overflow-hidden rounded-[1.25rem]"
        >
          <div
            className={
              tall
                ? "relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-auto lg:min-h-[520px]"
                : "relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[160px]"
            }
          >
            <Image
              src={image}
              alt={name}
              fill
              priority={priority}
              className="object-cover transition duration-700 group-hover:scale-[1.06]"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glare }}
            />
            <div
              className={
                tall
                  ? "absolute inset-x-0 bottom-0 p-5 sm:p-7"
                  : "absolute inset-x-0 bottom-0 p-4 sm:p-5"
              }
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#ffe0c2]">
                {en}
              </p>
              <h3
                className={
                  tall
                    ? "mt-1 font-display text-3xl font-semibold text-white sm:text-4xl"
                    : "mt-1 font-display text-xl font-semibold text-white sm:text-2xl"
                }
              >
                {name}
              </h3>
              <p className={`mt-1 text-sm text-white/75 ${tall ? "mt-2 max-w-sm text-white/80" : ""}`}>
                {blurb}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function Destinations({ showHeader = true }: { showHeader?: boolean }) {
  const [hero, ...rest] = destinations;

  return (
    <section className="relative isolate">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-xl">
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
            </div>
            <Link
              href="/destinations"
              className="text-sm font-semibold text-accent transition hover:opacity-80"
            >
              Бүх чиглэл →
            </Link>
          </motion.div>
        ) : null}

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 -z-10 overflow-hidden rounded-[2rem] opacity-80 sm:-inset-8">
            <ShaderBackdrop />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {hero ? (
              <DestCard
                href="/destinations"
                image={hero.image}
                en={hero.en}
                name={hero.name}
                blurb={hero.blurb}
                tall
                priority
                delay={0}
              />
            ) : null}

            <div className="flex flex-col gap-4">
              {rest.map((d, i) => (
                <DestCard
                  key={d.key}
                  href="/destinations"
                  image={d.image}
                  en={d.en}
                  name={d.name}
                  blurb={d.blurb}
                  delay={0.08 + i * 0.06}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
