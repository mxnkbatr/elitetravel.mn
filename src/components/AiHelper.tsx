"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

function textOf(message: { parts?: { type: string; text?: string }[]; content?: string }) {
  if (message.parts?.length) {
    return message.parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text!)
      .join("");
  }
  return typeof message.content === "string" ? message.content : "";
}

export function AiHelper() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    await sendMessage({ text: q });
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label="AI туслах"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-[70] inline-flex h-12 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(14, 143, 132,0.4)] sm:bottom-6 sm:right-6"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">AI</span>
        Туслах
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-4 z-[70] flex h-[min(70vh,440px)] w-[min(calc(100vw-2rem),360px)] flex-col overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated shadow-[0_24px_60px_rgba(10, 42, 38,0.18)] sm:bottom-24 sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  Elite AI
                </p>
                <p className="font-display text-lg font-semibold">Аяллын туслах</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-muted hover:bg-accent-mist hover:text-accent"
                aria-label="Хаах"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
              {messages.length === 0 ? (
                <p className="rounded-2xl bg-accent-mist/60 px-3 py-2.5 text-muted">
                  Жишээ: «Хайнань хямд аялал?» эсвэл «Хонг Конг хэд хоног?»
                </p>
              ) : null}
              {messages.map((m) => {
                const text = textOf(m);
                if (!text) return null;
                const mine = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`max-w-[90%] rounded-2xl px-3 py-2 leading-relaxed ${
                      mine
                        ? "ml-auto bg-accent text-white"
                        : "bg-bg text-foam border border-[var(--line)]"
                    }`}
                  >
                    {text}
                  </div>
                );
              })}
              {error ? (
                <p className="text-xs text-[#ff9b42]">
                  AI холболт хэрэгтэй. Vercel AI Gateway key нэмээд дахин оролдоорой — эсвэл +976 9003 1771.
                </p>
              ) : null}
              <div ref={bottom} />
            </div>

            <form onSubmit={onSubmit} className="border-t border-[var(--line)] p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Асуултаа бич…"
                  className="h-11 flex-1 rounded-full border border-[var(--line)] bg-bg px-4 text-sm outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
