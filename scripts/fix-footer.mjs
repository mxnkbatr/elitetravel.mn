import fs from "fs";
import path from "path";

const content = `import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 px-4 pb-6 pt-8 sm:px-6 sm:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.08em]">
            ELITE TRAVEL MONGOLIA
          </p>
          <p className="mt-1 text-xs tracking-[0.02em] text-foam/50">
            Explore. Dream. Discover.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.02em] text-foam/50">
          <Link href="/destinations" className="hover:text-foam">
            Чиглэл
          </Link>
          <Link href="/resorts" className="hover:text-foam">
            Амралтын газрууд
          </Link>
          <Link href="/tours" className="hover:text-foam">
            Аяллууд
          </Link>
          <Link href="/about" className="hover:text-foam">
            Бидний тухай
          </Link>
          <Link href="/contact" className="hover:text-foam">
            Холбоо барих
          </Link>
        </div>
        <p className="text-xs tracking-[0.02em] text-foam/45">
          © {new Date().getFullYear()} Elite Travel Mongolia
        </p>
      </div>
    </footer>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), "src/components/Footer.tsx"), content, "utf8");
console.log("ok Footer");
