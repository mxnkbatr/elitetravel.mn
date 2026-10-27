const channels = [
  {
    label: "Утас",
    value: "+976 9003 1771",
    href: "tel:+97690031771",
  },
  {
    label: "Instagram",
    value: "@elitetravel.mn",
    href: "https://www.instagram.com/elitetravel.mn/",
  },
  {
    label: "Вэб",
    value: "elitetravel.mn",
    href: "https://elitetravel.mn",
  },
];

export function Contact() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {channels.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.href.startsWith("http") ? "_blank" : undefined}
          rel={c.href.startsWith("http") ? "noreferrer" : undefined}
          className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-5 transition hover:border-accent/30"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
            {c.label}
          </p>
          <p className="mt-2 font-display text-xl font-semibold tracking-[-0.02em]">{c.value}</p>
        </a>
      ))}
    </div>
  );
}
