import { MobileNews } from "@/components/MobileNews";
import { NewsPage } from "@/components/NewsPage";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мэдээ мэдээлэл",
  description: "Шинэ аялал, урамшуулал, аялагчдад зориулсан зөвлөгөө.",
};

export default function NewsRoute() {
  return (
    <>
      <div className="sm:hidden">
        <MobileNews />
      </div>
    <Section className="hidden sm:block page-pad-top space-y-8 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Journal"
          title="Мэдээ мэдээлэл"
          description="Шинэ огноо, урамшуулал, аялахын өмнө мэдэх хэрэгтэй бүх зүйл."
        />
        <div className="mt-10">
          <NewsPage />
        </div>
      </div>
    </Section>
    </>
  );
}
