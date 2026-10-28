import { BookingsBoard, type AdminBooking } from "@/app/admin/(panel)/BookingsBoard";
import { requireAdmin } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase-admin";

export default async function AdminBookingsPage() {
  await requireAdmin();
  const { data, error } = await supabaseAdmin()!
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Захиалгын хүсэлтүүд</h1>
      <p className="mt-1 text-sm text-muted">Сайт болон аппаас ирсэн хүсэлтүүд. Төлөвийг өөрчилж, тэмдэглэл үлдээгээрэй.</p>
      {error ? (
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">Захиалга ачаалж чадсангүй.</p>
      ) : (
        <BookingsBoard bookings={(data ?? []) as AdminBooking[]} />
      )}
    </>
  );
}
