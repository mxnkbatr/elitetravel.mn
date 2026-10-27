import { About } from "@/components/About";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Elite Travel Mongolia — залууст зориулсан premium аялал.",
};

export default function AboutPage() {
  return (
    <Section className="page-pad-top pb-10">
      <div className="mx-auto max-w-6xl">
        <About showCta />
      </div>
    </Section>
  );
}
