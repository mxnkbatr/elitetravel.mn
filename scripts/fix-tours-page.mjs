import fs from "fs";

fs.writeFileSync(
  "src/app/tours/page.tsx",
  `import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Tours } from "@/components/Tours";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Аяллууд",
  description: "Elite Travel-ийн эрэлттэй болон удахгүй гарах аяллууд.",
};

type ToursPageProps = {
  searchParams: Promise<{ dest?: string }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;

  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Tours"
          title="Эрэлттэй аяллууд"
          description="Концерт, далай, хот — таны vibe-д таарсан аяллыг сонгоорой."
        />
      </div>
      <Tours showHeader={false} initialFilter={params.dest ?? "all"} />
    </Section>
  );
}
`,
  "utf8",
);
console.log("ok tours page");
