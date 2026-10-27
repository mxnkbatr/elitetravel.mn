import fs from "fs";
import path from "path";

const root = process.cwd();

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/app/layout.tsx",
  `import { AppShell } from "@/components/AppShell";
import type { Metadata, Viewport } from "next";
import { Geologica, Golos_Text } from "next/font/google";
import "./globals.css";

const display = Geologica({
  variable: "--font-geologica",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Elite Travel Mongolia | Explore. Dream. Discover.",
    template: "%s · Elite Travel",
  },
  description:
    "Залууст зориулсан premium аялал — Хонг Конг, Хайнань, Бали болон концерт аяллууд.",
  metadataBase: new URL("https://elitetravel.mn"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Elite Travel",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0d14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={\`\${display.variable} \${body.variable} h-full antialiased\`}
    >
      <body className="min-h-full font-sans text-foam">
        <div className="ambient" aria-hidden />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
`,
);

write(
  "src/data/tours.ts",
  `export type Tour = {
  id: string;
  title: string;
  destination: string;
  destinationKey: "hainan" | "hongkong" | "bali" | "soon";
  description: string;
  price: number | null;
  duration: string;
  rating: number;
  tag?: "hot" | "soon";
  image: string;
  dates?: string;
  highlights?: string[];
};

export function getTour(id: string) {
  return tours.find((t) => t.id === id);
}

export const destinations = [
  {
    key: "hainan",
    name: "Хайнань",
    en: "Hainan",
    blurb: "Далай, нар, амралт",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "hongkong",
    name: "Хонг Конг",
    en: "Hong Kong",
    blurb: "Хот, концерт, гэрэл",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "bali",
    name: "Бали",
    en: "Bali",
    blurb: "Арал, сэрүүн vibe",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "egypt",
    name: "Египет",
    en: "Egypt",
    blurb: "Удахгүй нээгдэнэ",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

export const tours: Tour[] = [
  {
    id: "weeknd-hk",
    title: "The Weeknd: Hong Kong аялал",
    destination: "Хонг Конг",
    destinationKey: "hongkong",
    description: "Тусгай аялал",
    price: 6590000,
    duration: "5 өдөр · 4 шөнө",
    rating: 4.9,
    tag: "hot",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "The Weeknd концертын тасалбар",
      "4 одтой зочид буудал",
      "Онгоцны тийз + шилжүүлэлт",
      "Хот үзэх хөтөлбөр",
    ],
  },
  {
    id: "dately-hainan",
    title: "Dately Show: Hainan Escape",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Тусгай хөтөлбөртэй аялал",
    price: 2990000,
    duration: "8 өдөр · 7 шөнө",
    rating: 4.8,
    tag: "hot",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Dately Show тусгай хөтөлбөр",
      "Далайн эргийн амралт",
      "7 шөнийн байр",
      "Өглөөний цай багтсан",
    ],
  },
  {
    id: "hainan-main",
    title: "Хайнань үндсэн аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй аялал",
    price: 2690000,
    duration: "8 өдөр · 7 шөнө",
    rating: 4.8,
    dates: "Тогтмол огноотой",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Тогтмол огноотой хөтөлбөр",
      "Далайн үзвэрүүд",
      "Групп аялал",
      "Монгол хөтөч",
    ],
  },
  {
    id: "hainan-flex",
    title: "Хайнань уян хатан аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Хүссэн үедээ эхлэх боломжтой",
    price: 3290000,
    duration: "8 өдөр · 7 шөнө",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Уян хатан огноо",
      "Илүү тансаг байр",
      "Хувийн хэрэгцээнд тохируулна",
      "Далайн + хотын combo",
    ],
  },
  {
    id: "bali",
    title: "Бали, Индонез",
    destination: "Бали",
    destinationKey: "bali",
    description: "Үндсэн хөтөлбөртэй аялал",
    price: 6290000,
    duration: "9 өдөр · 8 шөнө",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Убуд + далайн эрэг",
      "8 шөнийн байр",
      "Соёлын үзвэрүүд",
      "Хүссэн үедээ эхлэх боломжтой",
    ],
  },
  {
    id: "bts",
    title: "BTS үзвэртэй аялал",
    destination: "Удахгүй",
    destinationKey: "soon",
    description: "Шинэ аялал бэлтгэгдэж байна",
    price: null,
    duration: "Coming soon",
    rating: 5,
    tag: "soon",
    image:
      "https://images.unsplash.com/photo-1459749411177-0415448067f5?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Концертын тасалбар",
      "Хот үзэх хөтөлбөр",
      "Байр + шилжүүлэлт",
      "Удахгүй нээгдэнэ",
    ],
  },
];

export function formatPrice(price: number | null) {
  if (price == null) return "Удахгүй";
  const digits = String(price).replace(/\\B(?=(\\d{3})+(?!\\d))/g, "'");
  return \`₮\${digits}\`;
}
`,
);

console.log("done batch 1");
