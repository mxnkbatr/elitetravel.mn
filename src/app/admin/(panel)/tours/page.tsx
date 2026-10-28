import { ContentList } from "@/app/admin/(panel)/ContentList";
import { formatPrice, type Tour } from "@/data/tours";
import { requireAdmin } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import Link from "next/link";

export default async function AdminToursPage() {
  await requireAdmin();
  const { data } = await supabaseAdmin()!.from("tours").select("id, data").order("position").order("id");
  const tours = (data ?? []).map((r) => r.data as Tour);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Аяллууд</h1>
          <p className="mt-1 text-sm text-muted">Дараалал нь сайт дээр харагдах дарааллаар. Хадгалмагц сайт, апп шууд шинэчлэгдэнэ.</p>
        </div>
        <Link href="/admin/tours/new" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent">
          + Шинэ аялал
        </Link>
      </div>
      <ContentList
        table="tours"
        items={tours.map((t) => ({
          id: t.id,
          title: t.title,
          sub: [t.destination, t.duration, formatPrice(t.price), t.dates].filter(Boolean).join(" · "),
          image: t.image,
          badge: t.status === "ended" ? "Дууссан" : t.tag === "soon" ? "Удахгүй" : t.tag === "sale" ? "Хямдрал" : t.tag === "hot" ? "Эрэлттэй" : undefined,
          muted: t.status === "ended",
        }))}
      />
    </>
  );
}
