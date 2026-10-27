"use client";

import { motion } from "framer-motion";

const channels = [
  {
    label: "Instagram",
    detail: "DM-ээр холбогдох",
    href: "https://instagram.com",
  },
  {
    label: "Facebook",
    detail: "Messenger-ээр чатлах",
    href: "https://facebook.com",
  },
  {
    label: "Утас",
    detail: "+976 9003 1771",
    href: "tel:+97690031771",
  },
];

type ContactProps = {
  showIntro?: boolean;
};

export function Contact({ showIntro = true }: ContactProps) {
  return (
    <section className="relative z-10">
      <div className="relative overflow-hidden rounded-[28px] px-5 py-10 sm:rounded-[32px] sm:px-12 sm:py-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(94,235,195,0.18),rgba(12,31,28,0.3)),url('https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-bg/78 backdrop-blur-xl" />

        {showIntro ? (
          <div className="max-w-xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
              Contact
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.03em] sm:text-4xl">
              Захиалга өгөх
            </h2>
            <p className="mt-4 text-[0.95rem] tracking-[0.01em] text-foam/70 sm:text-base">
              Дуртай аялаа сонгоод шууд холбогдоорой. Бид танд хамгийн тохиромжтой
              хувилбарыг санал болгоно.
            </p>
          </div>
        ) : null}

        <div className={`grid gap-3 sm:grid-cols-3 ${showIntro ? "mt-8" : "mt-0"}`}>
          {channels.map((channel, i) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-[22px] glass p-5 transition active:scale-[0.98] hover:bg-white/10"
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
                {channel.label}
              </p>
              <p className="mt-2 font-display text-lg font-semibold tracking-[-0.02em]">
                {channel.detail}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
