import type { ReactNode } from "react";

/** iOS-style large title used at the top of phone screens. */
export function MobileTitle({ title, sub, aside }: { title: ReactNode; sub?: string; aside?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 pt-[calc(5.2rem+env(safe-area-inset-top))]">
      <div className="min-w-0">
        <h1 className="font-display text-[2.4rem] font-semibold leading-[0.95] tracking-[-0.04em]">{title}</h1>
        {sub ? <p className="mt-1.5 text-sm text-muted">{sub}</p> : null}
      </div>
      {aside}
    </div>
  );
}
