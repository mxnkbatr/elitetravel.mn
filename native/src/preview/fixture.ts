import type { CatalogPage } from "../lib/types";

const img = (id: string) => `https://res.cloudinary.com/ev6fygsf/image/upload/elitetravel/tours/${id}`;

/**
 * Design fixture copied from the public catalogue shape already seen on the Next.js site.
 * Used only when EXPO_PUBLIC_PREVIEW=1. The running app does not use this by default.
 */
export const previewCatalog: CatalogPage = {
  seats: {},
  news: [
    {
      id: "hainan-november",
      category: "Мэдээ",
      title: "Хайнань: 11-р сарын огноо",
      excerpt: "Шилэн гүүр, задгай далай, Атлантис усан парк, Сармагчингийн арал.",
      body: ["Энэ текст зөвхөн урьдчилсан харагдацын жишээ. Шууд серверийн мэдээ биш."],
      image: img("day5-atlantis-slide"),
      tourId: "hainan-4",
      readMin: 2,
    },
  ],
  tours: [
    {
      id: "bali",
      title: "Бали, Индонез",
      destination: "Бали",
      destinationKey: "bali",
      description: "Үндсэн хөтөлбөртэй аялал — хүссэн үедээ",
      story: "Балигийн хүрхрээ, ширэнгэн ой, сүм хийд, Нуса Пенида арлын оюу өнгөт далай.",
      price: 5790000,
      oldPrice: 6290000,
      discount: "-8%",
      duration: "9 өдөр · 8 шөнө",
      nights: 8,
      tag: "sale",
      dates: "Хүссэн үедээ",
      stay: "Bing Tang Bali Resort",
      departure: "Улаанбаатар",
      image: img("bali-island"),
      gallery: [img("nusa-penida-kelingking")],
      highlights: ["Нуса Пенида · Kelingking", "Диваажингийн хаалга", "Bali Swing"],
      includes: ["Нислэг", "Буудал", "Хөтөлбөрт тусгасан үзвэр"],
      excludes: ["Хувийн зардал"],
      pricing: { childSharedBed: 5490000, depositPercent: 50, singleSupplement: 1100000, childOwnBed: false },
      itinerary: [{ day: "1-р өдөр", title: "Улаанбаатар → Бали", detail: "Урьдчилсан харагдацын товч хөтөлбөр. Шууд серверийн хөтөлбөр биш." }],
    },
    {
      id: "dately-show-hainan",
      title: "Dately Show: Hainan Escape",
      destination: "Хайнань",
      destinationKey: "hainan",
      description: "Тусгай хөтөлбөртэй аялал — ганцхан удаа",
      price: 2990000,
      duration: "8 өдөр · 7 шөнө",
      nights: 7,
      tag: "hot",
      dates: "Тусгай аялал — огноог лавлана уу",
      departure: "Улаанбаатар",
      image: img("dately-show-hainan"),
      highlights: ["Dately Show", "Yacht Party"],
    },
    {
      id: "hainan-4",
      title: "Хайнань үндсэн аялал 11/10",
      destination: "Хайнань",
      destinationKey: "hainan",
      description: "Үндсэн хөтөлбөртэй аялал",
      story: "11-р сарын Хайнань аялал — шилэн гүүр, задгай далай, Атлантис усан парк, Сармагчингийн арал.",
      price: 2990000,
      duration: "8 өдөр · 7 шөнө",
      nights: 7,
      dates: "11/10 – 11/17",
      stay: "Timton Fuhe Hotel, Саняа",
      departure: "Улаанбаатар",
      image: img("hainan-main-sep15"),
      gallery: [img("tropical-aerial-coast"), img("day2-baishilin-glass-bridge"), img("day5-atlantis-slide"), img("day7-resort-pool")],
      highlights: ["Байшилин шилэн гүүр", "Задгай далайн аялал", "Атлантис усан парк", "Сармагчингийн арал"],
      includes: ["Улаанбаатар ↔ Хайнань нислэгийн тийз", "Зочид буудал", "Монгол хөтөч", "Аяллын даатгал"],
      excludes: ["Хөтөлбөрт тусгагдаагүй хоол", "Хувийн зардал, шоппинг"],
      pricing: { child: "2–12 нас: хамт унтвал ₮300'000 хямд", childSharedBed: 2690000, depositPercent: 30, singleSupplement: 700000 },
      itinerary: [
        { day: "1-р өдөр", title: "Улаанбаатар → Хайкоу шууд нислэг", detail: "Чингис хаан ОУНБ-аас орой 22:10 цагт ниснэ.", flight: "22:10 – 03:10 · Чингис хаан ОУНБ → Мейлан ОУНБ", hotel: "Hampton Hotel, Хайкоу" },
        { day: "2-р өдөр", title: "Хайкоу → Саняа · Байшилин шилэн гүүр", detail: "Шилэн гүүрээр алхаж Саняа руу хөдөлнө.", meals: "Өглөө, орой", hotel: "Timton Fuhe Hotel" },
      ],
    },
  ],
};
