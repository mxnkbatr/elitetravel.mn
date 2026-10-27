import { About } from "@/components/About";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Elite Travel Mongolia — Travel Beyond Ordinary. Сонгомол чиглэл, тансаг туршлага, найдвартай үйлчилгээ.",
};

export default function AboutPage() {
  return (
    <Section className="page-pad-top pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <About />
      </div>
    </Section>
  );
}
