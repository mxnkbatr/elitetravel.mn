import { MobileResorts } from "@/components/MobileResorts";
import { PageHeader } from "@/components/PageHeader";
import { ResortsPage } from "@/components/ResortsPage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Буудлууд",
  description: "Аялал бүрийн байрлах зочид буудлууд — Саняа, Бали, Хонг Конг.",
};

export default function ResortsRoute() {
  return (
    <>
      <div className="sm:hidden">
        <MobileResorts />
      </div>
    <Section className="hidden sm:block page-pad-top space-y-8 pb-12">
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
    </>
  );
}
