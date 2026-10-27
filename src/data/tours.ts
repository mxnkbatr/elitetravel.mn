export type TourItineraryDay = {
  day: string;
  title: string;
  detail: string;
};

export type Tour = {
  id: string;
  title: string;
  destination: string;
  destinationKey: "hainan" | "hongkong" | "bali" | "soon";
  description: string;
  story: string;
  price: number | null;
  duration: string;
  nights: number | null;
  rating: number;
  tag?: "hot" | "soon";
  image: string;
  gallery: string[];
  dates?: string;
  stay?: string;
  groupSize?: string;
  departure?: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: TourItineraryDay[];
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
    description: "Тусгай аялал — концерт + хот",
    story:
      "Victoria Harbour-ийн гэрлүүд, хотын хурд, The Weeknd-ийн тайз — нэг аялалд. Концертын оройг төвлөрүүлж, үлдсэн өдрүүдээр хот үзэх, night vibe мэдрэх хөтөлбөртэй.",
    price: 6590000,
    duration: "5 өдөр · 4 шөнө",
    nights: 4,
    rating: 4.9,
    tag: "hot",
    dates: "Концертын огноогоор",
    stay: "4 одтой зочид буудал · Kowloon / Central",
    groupSize: "Жижиг групп",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "The Weeknd концертын тасалбар",
      "4 одтой зочид буудал",
      "Онгоцны тийз + шилжүүлэлт",
      "Хот үзэх хөтөлбөр",
    ],
    includes: [
      "ОУ-ын тийз (UB ↔ HKG)",
      "4 шөнийн байр, өглөөний цайтай",
      "Концертын тасалбар",
      "Нисэх буудлын шилжүүлэлт",
      "Хот үзэх хөтөлбөр (1 өдөр)",
      "Монгол хөтөч",
    ],
    excludes: [
      "Хувийн зардал, хоол (огшлоо/орой)",
      "Нэмэлт үзвэр, шоппинг",
      "Аяллын даатгал",
    ],
    itinerary: [
      {
        day: "1-р өдөр",
        title: "Нислэг · суурьшил",
        detail: "UB-аас нисэж, зочид буудалд суурьшина. Орой Victoria Harbour-ийн гэрлүүдийг үзнэ.",
      },
      {
        day: "2-р өдөр",
        title: "Хот үзэх",
        detail: "Central, Peak эсвэл street food route — хотын vibe мэдрэх өдөр.",
      },
      {
        day: "3-р өдөр",
        title: "Концертын орой",
        detail: "Бэлтгэл + The Weeknd show. Шөнийн дараа буудал руу буцаана.",
      },
      {
        day: "4-р өдөр",
        title: "Чөлөөт цаг",
        detail: "Шоппинг, кафе, photo spot — өөрийнхөөрөө өнгөрүүлнэ.",
      },
      {
        day: "5-р өдөр",
        title: "Буцах нислэг",
        detail: "Check-out, шилжүүлэлт, Улаанбаатар руу буцна.",
      },
    ],
  },
  {
    id: "dately-hainan",
    title: "Dately Show: Hainan Escape",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Тусгай хөтөлбөртэй амралт",
    story:
      "Саньягийн далай + Dately Show — залуусын эрэлттэй combo. Өдөр бүр далай, орой show vibe. Амрахыг хүссэн ч event мэдрэмжтэй байхыг хүссэн хүмүүст.",
    price: 2990000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    tag: "hot",
    dates: "Show-ийн хуваариар",
    stay: "Далайн эргийн зочид буудал · Sanya",
    groupSize: "Групп аялал",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Dately Show тусгай хөтөлбөр",
      "Далайн эргийн амралт",
      "7 шөнийн байр",
      "Өглөөний цай багтсан",
    ],
    includes: [
      "ОУ-ын тийз",
      "7 шөнийн байр + өглөөний цай",
      "Dately Show хөтөлбөр",
      "Шилжүүлэлт",
      "Үндсэн үзвэрүүд",
      "Монгол хөтөч",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт усан спорт", "Даатгал"],
    itinerary: [
      {
        day: "1–2",
        title: "Ирэлт · далай",
        detail: "Саньяд бууж, буудалд суурьшина. Далайн эрэг, pool time.",
      },
      {
        day: "3–5",
        title: "Show + амралт",
        detail: "Dately Show орой, өдөр нь арал эсвэл далай.",
      },
      {
        day: "6–7",
        title: "Чөлөөт өдрүүд",
        detail: "Арал, shopping, cafe — хүссэнээрээ.",
      },
      {
        day: "8",
        title: "Буцах",
        detail: "Check-out, нислэг УБ руу.",
      },
    ],
  },
  {
    id: "hainan-main",
    title: "Хайнань үндсэн аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй далайн аялал",
    story:
      "Elite Travel-ийн хамгийн тогтмол огноотой Хайнань аялал. Далай, үзвэр, групп vibe — анх удаа явах хүмүүст тохиромжтой, үнэ/чанарын тэнцвэртэй.",
    price: 2690000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "Тогтмол огноотой",
    stay: "3–4 одтой зочид буудал · Sanya",
    groupSize: "Групп аялал",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Тогтмол огноотой хөтөлбөр",
      "Далайн үзвэрүүд",
      "Групп аялал",
      "Монгол хөтөч",
    ],
    includes: [
      "ОУ-ын тийз",
      "7 шөнийн байр + өглөөний цай",
      "Үндсэн үзвэрүүд",
      "Шилжүүлэлт",
      "Монгол хөтөч",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт усан спорт", "Даатгал"],
    itinerary: [
      {
        day: "1",
        title: "Нислэг · Sanya",
        detail: "Ирэлт, буудал, далайн эргийн эхний алхалт.",
      },
      {
        day: "2–4",
        title: "Үзвэр + далай",
        detail: "Үндсэн хөтөлбөрийн үзвэрүүд, далайн өдрүүд.",
      },
      {
        day: "5–7",
        title: "Амралт",
        detail: "Чөлөөт цаг, арал эсвэл хотын хэсэг.",
      },
      {
        day: "8",
        title: "Буцах",
        detail: "Нислэг Улаанбаатар руу.",
      },
    ],
  },
  {
    id: "hainan-flex",
    title: "Хайнань уян хатан аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Хүссэн үедээ эхлэх боломжтой",
    story:
      "Огноогоо өөрөө сонгох уян хатан аялал. Илүү тансаг байр, хувийн хэрэгцээнд тохируулсан хөтөлбөр — хос, найзуудтайгаа явахад тохиромжтой.",
    price: 3290000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "Уян хатан огноо",
    stay: "Илүү тансаг далайн буудал",
    groupSize: "Жижиг / private",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Уян хатан огноо",
      "Илүү тансаг байр",
      "Хувийн хэрэгцээнд тохируулна",
      "Далай + хотын combo",
    ],
    includes: [
      "ОУ-ын тийз",
      "7 шөнийн тансаг байр",
      "Шилжүүлэлт",
      "Тохируулсан үзвэр",
      "Зөвлөгөө / support",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт үйлчилгээ", "Даатгал"],
    itinerary: [
      {
        day: "1",
        title: "Ирэлт",
        detail: "Саньяд бууж, буудалд суурьшина.",
      },
      {
        day: "2–6",
        title: "Таны хөтөлбөр",
        detail: "Далай, арал, хот — хүссэнээрээ хольж болно.",
      },
      {
        day: "7–8",
        title: "Амралт · буцах",
        detail: "Сүүлийн өдөр chill, дараа нь УБ руу.",
      },
    ],
  },
  {
    id: "bali",
    title: "Бали, Индонез",
    destination: "Бали",
    destinationKey: "bali",
    description: "Арал + Ubud үндсэн хөтөлбөр",
    story:
      "Убудын ногоон ой, далайн эрэг, соёлын үзвэр — reset хийхэд тохиромжтой 9 өдөр. Сэрүүн vibe хайж буй залууст.",
    price: 6290000,
    duration: "9 өдөр · 8 шөнө",
    nights: 8,
    rating: 4.9,
    dates: "Хүссэн үедээ эхлэх боломжтой",
    stay: "Ubud + далайн эргийн буудал",
    groupSize: "Жижиг групп / уян",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Убуд + далайн эрэг",
      "8 шөнийн байр",
      "Соёлын үзвэрүүд",
      "Хүссэн үедээ эхлэх боломжтой",
    ],
    includes: [
      "ОУ-ын тийз",
      "8 шөнийн байр",
      "Үндсэн үзвэрүүд",
      "Дотоод шилжүүлэлт",
      "Зөвлөгөө / support",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт spa / activity", "Даатгал"],
    itinerary: [
      {
        day: "1–2",
        title: "Ubud",
        detail: "Ой, temple, cafe — сэрүүн эхлэл.",
      },
      {
        day: "3–5",
        title: "Соёл + nature",
        detail: "Үзвэр, rice terrace, local vibe.",
      },
      {
        day: "6–8",
        title: "Далайн эрэг",
        detail: "Seminyak / beach days, sunset.",
      },
      {
        day: "9",
        title: "Буцах",
        detail: "Нислэг УБ руу.",
      },
    ],
  },
  {
    id: "bts",
    title: "BTS үзвэртэй аялал",
    destination: "Удахгүй",
    destinationKey: "soon",
    description: "Шинэ аялал бэлтгэгдэж байна",
    story:
      "Концерт + хот үзэх шинэ хөтөлбөр бэлтгэгдэж байна. Сонирхож байгаа бол холбогдоод waitlist-д бүртгүүлээрэй — нээгдэхэд эхний мэдээг хүргэнэ.",
    price: null,
    duration: "Coming soon",
    nights: null,
    rating: 5,
    tag: "soon",
    dates: "Удахгүй зарлана",
    stay: "Тун удахгүй",
    groupSize: "Тун удахгүй",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Концертын тасалбар",
      "Хот үзэх хөтөлбөр",
      "Байр + шилжүүлэлт",
      "Удахгүй нээгдэнэ",
    ],
    includes: ["Тун удахгүй дэлгэрэнгүй зарлана"],
    excludes: ["Одоогоор баталгаажаагүй"],
    itinerary: [
      {
        day: "Soon",
        title: "Хөтөлбөр бэлтгэгдэж байна",
        detail: "Нээгдэхэд өдөр тутмын хуваарь нийтлэгдэнэ.",
      },
    ],
  },
];

export function formatPrice(price: number | null) {
  if (price == null) return "Удахгүй";
  const digits = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `₮${digits}`;
}

export function relatedTours(tourId: string, limit = 3) {
  const current = getTour(tourId);
  if (!current) return tours.slice(0, limit);
  const same = tours.filter(
    (t) => t.id !== tourId && t.destinationKey === current.destinationKey,
  );
  const rest = tours.filter(
    (t) => t.id !== tourId && t.destinationKey !== current.destinationKey,
  );
  return [...same, ...rest].slice(0, limit);
}
