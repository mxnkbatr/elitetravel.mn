import { BookingsPage } from "@/components/BookingsPage";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Миний захиалгууд",
  description: "Таны захиалгын хүсэлтүүд болон хадгалсан аяллууд.",
};

export default function BookingsRoute() {
  return (
    <Section className="page-pad-top space-y-8 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="My trips"
          title="Миний захиалгууд"
          description="Үүсгэсэн хүсэлт, хадгалсан аяллууд, хөдлөх хүртэлх хугацаа — бүгд нэг дор."
        />
        <div className="mt-10">
          <BookingsPage />
        </div>
      </div>
    </Section>
  );
}
