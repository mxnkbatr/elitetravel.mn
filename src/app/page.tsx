"use client";

import { CinematicBand } from "@/components/CinematicBand";
import { Destinations } from "@/components/Destinations";
import { FeaturedTour } from "@/components/FeaturedTour";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { PromiseStrip } from "@/components/PromiseStrip";
import { Section } from "@/components/Section";
import { ToursCarousel } from "@/components/ToursCarousel";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

function HomeCta() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[1.6rem]"
      >
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full scale-105 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/section-banner-frame.jpg"
            aria-hidden
          >
            <source src="/media/section-banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#041f1f]/62" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(46,196,182,0.25),transparent_55%)]" />
        </div>
        <div className="relative px-6 py-14 text-white sm:px-10 sm:py-16">
          <div className="epic-rule mb-5 bg-gradient-to-r from-[#e8b86d] to-[#7ef0e0]" />
          <h2 className="max-w-lg font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Дараагийн аяллаа хамтдаа төлөвлөе
          </h2>
          <p className="mt-3 max-w-lg text-white/85">
            Instagram, Messenger эсвэл утсаар шууд холбогдоорой — Elite Travel зөвлөхүүд тусална.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-ink"
            >
              Холбоо барих
            </Link>
            <a
              href="tel:+97690031771"
              className="inline-flex h-11 items-center rounded-full border border-white/45 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm"
            >
              +976 9003 1771
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Section className="space-y-16 py-10 sm:space-y-20 sm:py-16">
        <ToursCarousel />
        <PromiseStrip />
      </Section>

      <CinematicBand
        eyebrow="Coastal dream"
        title="Далай, нар, мөрөөдлийн чиглэлүүд"
        body="Dreamina cinematic vibe — Elite Travel-ийн бодит аяллуудтай танилцаарай."
        ctaHref="/destinations"
        ctaLabel="Чиглэлүүд үзэх →"
      />

      <Section className="space-y-16 py-12 sm:space-y-20 sm:py-16">
        <Destinations />
        <FeaturedTour />
        <HomeCta />
      </Section>
    </>
  );
}
