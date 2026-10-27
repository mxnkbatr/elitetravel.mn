import Link from "next/link";

type EliteLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
  light?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: 32, elite: "text-[1.2rem]", travel: "text-[0.55rem]", gap: "gap-2" },
  md: { mark: 40, elite: "text-[1.4rem]", travel: "text-[0.58rem]", gap: "gap-2.5" },
  lg: { mark: 52, elite: "text-[1.75rem]", travel: "text-[0.62rem]", gap: "gap-3" },
  hero: { mark: 64, elite: "text-[2.15rem]", travel: "text-[0.68rem]", gap: "gap-3.5" },
};

function Mark({
  size,
  light,
  uid,
}: {
  size: number;
  light: boolean;
  uid: string;
}) {
  const gold = light ? "#f3e0c2" : "#e8b86d";
  const goldDeep = light ? "#e8b86d" : "#c9964a";
  const waveA = light ? "#7ef0e0" : "#18a89b";
  const waveB = light ? "#2ec4b6" : "#0e8f84";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="shrink-0"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-sun`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#fff1c2" />
          <stop offset="55%" stopColor={gold} />
          <stop offset="100%" stopColor={goldDeep} />
        </linearGradient>
        <linearGradient id={`${uid}-wave`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={waveA} />
          <stop offset="100%" stopColor={waveB} />
        </linearGradient>
      </defs>

      {/* refined sun rays — only upper arc */}
      {[210, 230, 250, 270, 290, 310, 330].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const x1 = 32 + Math.cos(a) * 12;
        const y1 = 24 + Math.sin(a) * 12;
        const x2 = 32 + Math.cos(a) * 18.5;
        const y2 = 24 + Math.sin(a) * 18.5;
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={gold}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}

      <circle cx="32" cy="24" r="7.5" fill={`url(#${uid}-sun)`} />

      {/* single elegant wave */}
      <path
        d="M8 46
           C14 38, 22 38, 28 43
           C34 48, 40 48, 46 42
           C50 38, 54 38, 58 41
           L58 54
           C50 50, 42 52, 34 50
           C26 48, 18 52, 8 50 Z"
        fill={`url(#${uid}-wave)`}
      />
      <path
        d="M10 49
           C18 45, 24 47, 32 50
           C40 53, 48 49, 56 48"
        fill="none"
        stroke={light ? "rgba(255,255,255,0.35)" : "rgba(255,253,249,0.35)"}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EliteLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  light = false,
  className = "",
}: EliteLogoProps) {
  const s = sizes[size];
  const ink = light ? "#fffef8" : "#0a2a26";
  const accent = light ? "#7ef0e0" : "#0e8f84";
  // unique gradient ids when multiple logos on one page
  const uid = `el-${size}-${light ? "l" : "d"}`;

  const inner = (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <Mark size={s.mark} light={light} uid={uid} />
      {showWordmark ? (
        <span className="flex flex-col justify-center leading-none">
          <span
            className={`font-display font-semibold lowercase tracking-[-0.045em] ${s.elite}`}
            style={{ color: ink }}
          >
            elite
          </span>
          <span
            className={`mt-[0.35em] font-semibold uppercase tracking-[0.28em] ${s.travel}`}
            style={{ color: accent }}
          >
            travel
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Elite Travel">
      {inner}
    </Link>
  );
}
