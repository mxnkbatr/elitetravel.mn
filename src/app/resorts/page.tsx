import { PageHeader } from "@/components/PageHeader";
import { ResortsPageView } from "@/components/ResortsPage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Амралтын газрууд",
  description: "Хайнань, Бали, Хонг Конгын амралтын газрууд — Elite Travel.",
};

export default function ResortsPage() {
  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Resorts"
          title="Амралтын газрууд"
          description="Далай, арал, хот — амрах газруудын цуглуулга. Дуртайгаа сонгоод холбогдоорой."
        />
      </div>
      <ResortsPageView />
    </Section>
  );
}
