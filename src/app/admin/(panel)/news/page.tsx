import { ContentList } from "@/app/admin/(panel)/ContentList";
import type { NewsItem } from "@/data/news";
import { requireAdmin } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import Link from "next/link";

export default async function AdminNewsPage() {
  await requireAdmin();
  const { data } = await supabaseAdmin()!.from("news").select("id, data").order("position").order("id");
  const news = (data ?? []).map((r) => r.data as NewsItem);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Мэдээ</h1>
          <p className="mt-1 text-sm text-muted">Эхний 3 мэдээ нүүр хэсэгт онцолж харагдана.</p>
        </div>
        <Link href="/admin/news/new" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent">
          + Шинэ мэдээ
        </Link>
      </div>
      <ContentList
        table="news"
        items={news.map((n) => ({ id: n.id, title: n.title, sub: n.excerpt, image: n.image, badge: n.category }))}
      />
    </>
  );
}
