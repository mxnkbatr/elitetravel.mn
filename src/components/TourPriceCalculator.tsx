"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Icon } from "@/components/Icon";
import { formatPrice, type TourSummary } from "@/data/tours";
import { useLiveRates } from "@/hooks/use-sale";
import { haptic } from "@/lib/native";
import {
  ODD_LABEL,
  PAIR_LABEL,
  assignedChildrenCount,
  calculateTourPrice,
  canAddMoreChildren,
  childrenMaxOf,
  hasOddOf,
  initialCalculatorState,
  pairCountOf,
  resolveCalculator,
  setAdults,
  setChildren,
  setOddChoice,
  setOddKids,
  setPairChoice,
  setPairKids,
  togglePairExpanded,
  visiblePairs,
  type CalculatorQuote,
  type CalculatorState,
  type PairChoice,
  type Rates,
  type RoomKids,
} from "@/lib/tour-calculator";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const glass = "rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md";

function Counter({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max?: number;
  onChange: (n: number) => void;
}) {
  const atMax = max != null && value >= max;
  return (
    <div className={`${glass} flex items-center justify-between gap-3 px-4 py-3`}>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {hint ? <p className="mt-0.5 text-[0.72rem] leading-snug text-white/55">{hint}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="-"
          disabled={value <= min}
          onClick={() => {
            haptic("tap");
            onChange(value - 1);
          }}
          className="tap grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition enabled:hover:border-white/40 disabled:opacity-30"
        >
          <Icon name="minus" size={14} />
        </button>
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-7 text-center font-num text-lg font-semibold tabular-nums text-white"
        >
          {value}
        </motion.span>
        <button
          type="button"
          aria-label="+"
          disabled={atMax}
          onClick={() => {
            haptic("tap");
            onChange(value + 1);
          }}
          className="tap grid size-9 place-items-center rounded-full border border-white/25 bg-white/15 text-white transition enabled:hover:bg-white/25 disabled:opacity-30"
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}

function SaleCountdown({ endsAt }: { endsAt: string }) {
  const ends = useMemo(() => Date.parse(endsAt), [endsAt]);
  const [left, setLeft] = useState(() => Math.max(0, ends - Date.now()));
  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(0, ends - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [ends]);
  if (left <= 0) return null;
  const s = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = Math.floor(s / 86400);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/15 px-2.5 py-1 font-num text-[0.72rem] text-amber-100">
      <Icon name="clock" size={12} />
      {d > 0 ? `${d} өдөр ` : ""}
      {pad(Math.floor((s % 86400) / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
    </span>
  );
}

function RadioRow({
  active,
  label,
  caption,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  caption: string;
  onClick: () => void;
  icon?: "pair" | "singles";
}) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic("tap");
        onClick();
      }}
      className={`flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
        active ? "border-teal-300/60 bg-teal-300/15" : "border-white/10 bg-black/20 hover:border-white/30"
      }`}
    >
      <span className={`mt-0.5 size-3.5 shrink-0 rounded-full border-2 ${active ? "border-teal-300 bg-teal-300" : "border-white/35"}`} />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-[0.8rem] font-semibold leading-snug text-white">{label}</span>
          {icon ? (
            <span className="flex shrink-0 items-center gap-0.5 text-white/50">
              <Icon name="user" size={12} />
              <Icon name="user" size={12} className={icon === "singles" ? "opacity-90" : "-ml-1.5 opacity-90"} />
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-[0.68rem] text-white/55">{caption}</span>
      </span>
    </button>
  );
}

function OccupancyBadge({ adults, children }: { adults: number; children: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[0.68rem] text-white/70">
      <span className="inline-flex items-center gap-0.5">
        <Icon name="user" size={11} /> {adults}
      </span>
      {children > 0 ? (
        <span className="inline-flex items-center gap-0.5">
          <Icon name="baby" size={11} /> {children}
        </span>
      ) : null}
    </span>
  );
}

function RoomChildOptions({
  roomSelected,
  childrenSelected,
  kids,
  allowExtra,
  canAdd,
  onChange,
}: {
  roomSelected: boolean;
  childrenSelected: boolean;
  kids: RoomKids;
  allowExtra: boolean;
  canAdd: boolean;
  onChange: (k: RoomKids) => void;
}) {
  if (!roomSelected) {
    return <p className="mt-2 text-[0.7rem] text-white/45">Өрөө сонгоогүй тул идэвхгүй</p>;
  }
  if (!childrenSelected) {
    return <p className="mt-2 text-[0.7rem] text-white/45">Хүүхэд сонгоогүй бол идэвхгүй</p>;
  }

  const extraActive = kids.extraBed;
  const canToggleExtraOn = allowExtra && (extraActive || canAdd);
  const canPlusShare = kids.withParents < 2 && canAdd;

  return (
    <div className="mt-2.5 space-y-2">
      {allowExtra ? (
        <button
          type="button"
          disabled={!canToggleExtraOn && !extraActive}
          onClick={() => {
            if (!extraActive && !canAdd) return;
            haptic("tap");
            onChange({ ...kids, extraBed: !extraActive });
          }}
          className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition disabled:opacity-40 ${
            extraActive ? "border-teal-300/60 bg-teal-300/15" : "border-white/10 bg-black/20 enabled:hover:border-white/30"
          }`}
        >
          <span className={`size-3.5 shrink-0 rounded-[3px] border-2 ${extraActive ? "border-teal-300 bg-teal-300" : "border-white/35"}`} />
          <span className="min-w-0">
            <span className="block text-[0.78rem] font-semibold text-white">Хүүхэд нэмэх — нэмэлт ортой</span>
            <span className="mt-0.5 block text-[0.66rem] text-white/55">Том хүнтэй ижил үнэ</span>
          </span>
        </button>
      ) : null}

      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[0.78rem] font-semibold text-white">Хүүхэд нэмэх — хамт унтах</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="-"
            disabled={kids.withParents <= 0}
            onClick={() => {
              haptic("tap");
              onChange({ ...kids, withParents: Math.max(0, kids.withParents - 1) });
            }}
            className="tap grid size-8 place-items-center rounded-full border border-white/15 bg-white/5 disabled:opacity-30"
          >
            <Icon name="minus" size={12} />
          </button>
          <span className="w-5 text-center font-num text-sm tabular-nums">{kids.withParents}</span>
          <button
            type="button"
            aria-label="+"
            disabled={!canPlusShare}
            onClick={() => {
              haptic("tap");
              onChange({ ...kids, withParents: kids.withParents + 1 });
            }}
            className="tap grid size-8 place-items-center rounded-full border border-white/25 bg-white/15 disabled:opacity-30"
          >
            <Icon name="plus" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Lovable Hainan-mode room calculator: live total always; summary when pairCount>0 and complete.
 */
export function TourPriceCalculator({
  tour,
  state,
  onChange,
  quote,
  rates,
}: {
  tour: TourSummary;
  state: CalculatorState;
  onChange: (s: CalculatorState) => void;
  quote: CalculatorQuote;
  rates: Rates;
}) {
  const settings = resolveCalculator(tour, rates);
  const allowExtra = settings.allowChildExtraBed;
  const pairs = visiblePairs(state);
  const pairCount = pairCountOf(state.adults);
  const hasOdd = hasOddOf(state.adults);
  const canAdd = canAddMoreChildren(state);
  const fee = formatPrice(settings.singleSupplement);
  const isBali = Boolean(settings.childBasePrice != null);
  const childNote = isBali
    ? `${formatPrice(quote.childPrice)} ор эзлэхгүй тохиолдолд.`
    : state.adults === 1 && state.children === 1
      ? "1 том хүн + 1 хүүхэд бол хүүхэд том хүний үнээр"
      : `Нэмэлт ортой бол том хүнтэй ижил үнэ · хамт унтвал ${formatPrice(quote.childPrice)} / хүүхэд (${formatPrice(quote.perChildDiscount)}-р хямд)`;

  const remainingBadge =
    quote.totalRemaining > 0 ? (
      <span className="rounded-full border border-amber-300/35 bg-amber-400/15 px-2.5 py-1 text-[0.68rem] font-semibold text-amber-100">
        {quote.remainingLabel}
      </span>
    ) : null;

  return (
    <section className="relative mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0a1114]/85 p-4 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-5">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-teal-400/15 blur-3xl" aria-hidden />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/10">
            <Icon name="calculator" size={18} />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Аяллын тооцоолол</h3>
            <p className="text-[0.72rem] text-white/55">Аялагчдын нийт тоо болон өрөөний сонголтоо хийж, нийт үнийг шууд хараарай.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[0.68rem] text-white/50">Том хүн / 1 хүн</p>
          {quote.originalPrice ? <p className="font-num text-xs text-white/45 line-through">{formatPrice(quote.originalPrice)}</p> : null}
          <p className="font-num text-2xl font-bold tabular-nums">{formatPrice(quote.adultPrice)}</p>
          {quote.originalPrice && rates.saleEndsAt ? (
            <div className="mt-1">
              <SaleCountdown endsAt={rates.saleEndsAt} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative mt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/70">
          <Icon name="users" size={14} /> Аялагчдын тоо
        </p>
        <div className="grid gap-2">
          <Counter
            label="Насан хүрсэн аялагч"
            hint={`12-с дээш нас · ${formatPrice(quote.adultPrice)} / хүн`}
            value={state.adults}
            min={1}
            onChange={(n) => onChange(setAdults(state, n, allowExtra))}
          />
          <Counter
            label="Хүүхэд / 2-12 нас/"
            hint={childNote}
            value={state.children}
            min={0}
            max={childrenMaxOf(state.adults, allowExtra)}
            onChange={(n) => onChange(setChildren(state, n, allowExtra))}
          />
        </div>
        {state.children > 0 ? (
          <p className="mt-2 text-[0.7rem] leading-relaxed text-white/50">
            Хүүхдүүдийг доорх өрөө бүр дээр нэмэлтээр сонгоно. Нэг өрөөнд хамгийн ихдээ 1 нэмэлт ортой, 2 хамт унтах хүүхэд байна.
          </p>
        ) : null}
      </div>

      {pairCount > 0 ? (
        <div className="relative mt-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
              <Icon name="bed" size={14} /> Хос бүрийн өрөөний сонголт
            </p>
            {remainingBadge}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {pairs.map((room, i) => {
              const expanded = state.expandedPairs[i] ?? true;
              const kidCount = (room.kids.extraBed ? 1 : 0) + room.kids.withParents;
              const peopleHere = room.choice != null ? 2 + kidCount : 0;
              return (
                <div key={i} className={`${glass} overflow-hidden`}>
                  <button
                    type="button"
                    onClick={() => onChange(togglePairExpanded(state, i))}
                    className="flex w-full items-start justify-between gap-2 px-3.5 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[0.72rem] font-semibold text-white/55">Хос {i + 1}</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        {room.choice ? PAIR_LABEL[room.choice] : "Өрөө сонгоогүй байна"}
                      </p>
                      {room.choice ? (
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] text-white/55">
                          <OccupancyBadge adults={2} children={kidCount} />
                          <span>{peopleHere} аялагч энэ өрөөнд</span>
                          {quote.totalRemaining === 0 ? <span className="text-emerald-300">Бүгд хуваарилагдлаа</span> : null}
                        </p>
                      ) : null}
                      {room.choice && kidCount > 0 ? (
                        <p className="mt-1 flex flex-wrap gap-2 text-[0.66rem] text-white/50">
                          {room.kids.extraBed ? (
                            <span className="inline-flex items-center gap-0.5">
                              <Icon name="plus" size={10} /> Хүүхэд (нэмэлт ортой)
                            </span>
                          ) : null}
                          {room.kids.withParents > 0 ? (
                            <span className="inline-flex items-center gap-0.5">
                              <Icon name="plus" size={10} /> Хүүхэд (нэмэлт оргүй) ×{room.kids.withParents}
                            </span>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[0.7rem] text-white/55">
                      {expanded ? "Хаах" : "Нээх"}
                      <Icon name={expanded ? "chevron-up" : "chevron-down"} size={14} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10"
                      >
                        <div className="space-y-1.5 p-3.5 pt-3">
                          {(["double", "twin", "twoSingles"] as PairChoice[]).map((id) => (
                            <RadioRow
                              key={id}
                              active={room.choice === id}
                              label={PAIR_LABEL[id]}
                              caption={id === "twoSingles" ? `Хүн тус бүр ${fee} нэмэлт` : "Үнэд багтсан"}
                              icon={id === "twoSingles" ? "singles" : "pair"}
                              onClick={() => onChange(setPairChoice(state, i, id))}
                            />
                          ))}
                          <RoomChildOptions
                            roomSelected={room.choice != null}
                            childrenSelected={state.children > 0}
                            kids={room.kids}
                            allowExtra={allowExtra}
                            canAdd={canAdd}
                            onChange={(kids) => onChange(setPairKids(state, i, kids, allowExtra))}
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}

            {hasOdd ? (
              <OddCard
                state={state}
                quote={quote}
                fee={fee}
                allowExtra={allowExtra}
                canAdd={canAdd}
                remainingBadge={pairCount === 0 ? remainingBadge : null}
                onChange={onChange}
              />
            ) : null}
          </div>
        </div>
      ) : hasOdd ? (
        <div className="relative mt-5">
          <OddCard
            state={state}
            quote={quote}
            fee={fee}
            allowExtra={allowExtra}
            canAdd={canAdd}
            remainingBadge={remainingBadge}
            onChange={onChange}
          />
        </div>
      ) : null}

      <div className="relative mt-4 space-y-2">
        {!quote.ready ? (
          <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-[0.72rem] font-semibold text-amber-100">
            Урьдчилсан дүн — хуваарилалт дутуу{quote.remainingLabel ? ` · ${quote.remainingLabel}` : ""}
          </p>
        ) : null}
        {settings.depositPercent > 0 ? (
          <div className={`${glass} flex items-baseline justify-between gap-3 px-4 py-3 text-sm`}>
            <span className="text-white/70">Урьдчилгаа төлбөр ({settings.depositPercent}%)</span>
            <AnimatedNumber value={quote.deposit} format={formatPrice} className="font-num font-semibold tabular-nums text-teal-200" />
          </div>
        ) : null}
        <div className={`${glass} flex items-baseline justify-between gap-3 px-4 py-3.5`}>
          <span className="font-semibold">{quote.ready ? "Нийт төлөх дүн" : "Урьдчилсан дүн"}</span>
          <AnimatedNumber value={quote.total} format={formatPrice} className="font-num text-2xl font-bold tabular-nums" />
        </div>
        <p className="text-[0.68rem] leading-relaxed text-white/45">
          Тооцоолол нь урьдчилсан байдлаар гарч байгаа тул эцсийн дүнг манай баг баталгаажуулна.
        </p>
      </div>

      <AnimatePresence initial={false}>
        {quote.summaryReady ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`${glass} relative mt-4 space-y-2 p-4 text-sm`}
          >
            <p className="text-sm font-semibold">Таны сонголтын хүснэгт</p>
            <div className="space-y-1.5 text-white/70">
              <div className="flex justify-between gap-3">
                <span>Аялагчид</span>
                <span className="text-right text-white/85">
                  {[
                    `${state.adults} том хүн`,
                    quote.childWithBed ? `${quote.childWithBed} хүүхэд /нэмэлт ортой/` : "",
                    quote.childNoBed ? `${quote.childNoBed} хүүхэд /нэмэлт оргүй/` : "",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Өрөөний сонголт</span>
                <span className="text-right text-white/85">
                  {[
                    ...pairs.map((r, i) => (r.choice ? `Хос ${i + 1}: ${PAIR_LABEL[r.choice]}` : null)),
                    hasOdd && state.oddRoom?.choice ? ODD_LABEL[state.oddRoom.choice] : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              {quote.savings > 0 ? (
                <div className="flex justify-between gap-3 text-emerald-300">
                  <span>Хэмнэлт</span>
                  <span className="font-num tabular-nums">{formatPrice(quote.savings)}</span>
                </div>
              ) : null}
              {quote.oddFee + quote.pairSinglesFee > 0 ? (
                <div className="flex justify-between gap-3">
                  <span>Нэмэлтүүд</span>
                  <span className="font-num tabular-nums text-white/85">
                    {formatPrice(quote.oddFee + quote.pairSinglesFee)}
                    {quote.twoSinglesCount ? ` · тус тусдаа ×${quote.twoSinglesCount}` : ""}
                  </span>
                </div>
              ) : null}
              {settings.depositPercent > 0 ? (
                <div className="flex justify-between gap-3">
                  <span>Урьдчилгаа ({settings.depositPercent}%)</span>
                  <span className="font-num tabular-nums text-white/85">{formatPrice(quote.deposit)}</span>
                </div>
              ) : null}
              <div className="flex justify-between gap-3 border-t border-white/10 pt-2 font-semibold text-white">
                <span>Нийт төлөх дүн</span>
                <span className="font-num tabular-nums">{formatPrice(quote.total)}</span>
              </div>
            </div>
            <p className="pt-1 text-[0.68rem] text-white/45">Та энэхүү хүснэгтийг screenshot хийж, манай менежертэй мэдээллээ солилцоорой.</p>
            <p className="text-[0.66rem] text-white/35">Хуваарилсан хүүхэд: {assignedChildrenCount(state)} / {state.children}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function OddCard({
  state,
  quote,
  fee,
  allowExtra,
  canAdd,
  remainingBadge,
  onChange,
}: {
  state: CalculatorState;
  quote: CalculatorQuote;
  fee: string;
  allowExtra: boolean;
  canAdd: boolean;
  remainingBadge: ReactNode;
  onChange: (s: CalculatorState) => void;
}) {
  const choice = state.oddRoom?.choice ?? null;
  const kids = state.oddRoom?.kids ?? { extraBed: false, withParents: 0 };
  // Lovable quirk: row hides once remainingChildren hits 0, even if withChild is still selected
  const showWithChild = quote.remainingChildren > 0;

  return (
    <div className={`${glass} p-3.5 md:col-span-1`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-white/55">
            <Icon name="user" size={12} /> Сондгой аялагчийн сонголт
          </p>
          <p className="mt-1 text-[0.7rem] leading-relaxed text-white/50">
            Доорх сонголтуудаас үлдсэн аялагчдын байрлах хэлбэрийг сонгоно уу.
          </p>
        </div>
        {remainingBadge}
      </div>

      <div className="mt-3 space-y-1.5">
        <RadioRow
          active={choice === "shared"}
          label={ODD_LABEL.shared}
          caption="Нэмэлт төлбөргүй · хуваалцах хүсэлт, зохицуулалт хүлээгдэнэ"
          onClick={() => onChange(setOddChoice(state, "shared"))}
        />
        {showWithChild ? (
          <RadioRow
            active={choice === "withChild"}
            label={ODD_LABEL.withChild}
            caption="Нэмэлт төлбөргүй"
            onClick={() => onChange(setOddChoice(state, "withChild"))}
          />
        ) : null}
        <RadioRow
          active={choice === "single"}
          label={ODD_LABEL.single}
          caption={`Нэмэлт төлбөр ${fee}`}
          onClick={() => onChange(setOddChoice(state, "single"))}
        />
      </div>

      <RoomChildOptions
        roomSelected={choice != null}
        childrenSelected={state.children > 0}
        kids={kids}
        allowExtra={allowExtra}
        canAdd={canAdd}
        onChange={(k) => onChange(setOddKids(state, k, allowExtra))}
      />

      <p className="mt-3 text-[0.7rem] text-white/50">
        {choice != null ? "Өрөөний сонголт хийгдсэн" : "Өрөөний сонголт хийгдээгүй"}
      </p>
    </div>
  );
}

/** Calculator quote for the chosen departure, using the same live prices the page shows. */
export function useTourCalculator(tour: TourSummary, state: CalculatorState, date?: string | null) {
  const rates = useLiveRates(tour, date);
  const quote = useMemo(() => calculateTourPrice(tour, state, rates), [tour, state, rates]);
  return { quote, rates };
}

export { initialCalculatorState };
