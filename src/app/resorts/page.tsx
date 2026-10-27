import { PageHeader } from "@/components/PageHeader";
import { ResortsPage } from "@/components/ResortsPage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Амралт",
  description: "Далайн амралт, зочид буудлууд.",
};

export default function ResortsRoute() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Resorts"
          title="Таны буудаллах газрууд"
          description="Аялал бүрийн буудлыг хөтөлбөртэй нь хамт — хаана байрлаж, юу үзэхээ урьдчилан мэдээрэй."
        />
        <div className="mt-8">
          <ResortsPage />
        </div>
      </div>
    </Section>
  );
}
