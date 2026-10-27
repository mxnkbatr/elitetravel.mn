const points = [
  {
    title: "Explore",
    body: "Хайнань, Хонг Конг, Бали — бодит чиглэл, бодит огноо.",
  },
  {
    title: "Dream",
    body: "Концерт аялал, далайн амралт — таны vibe-д тааруулна.",
  },
  {
    title: "Discover",
    body: "Монгол хөтөч, ил тод үнэ, найдвартай зохион байгуулалт.",
  },
];

export function About() {
  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Elite Travel Mongolia нь залууст зориулсан аяллын бренд. Бид elitetravel.mn дээрх
        аяллуудыг цэвэр, орчин үеийн туршлагаар танд хүргэнэ.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {points.map((p) => (
          <div
            key={p.title}
            className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-5"
          >
            <div className="epic-rule mb-4" />
            <h3 className="font-display text-2xl font-semibold text-accent">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
