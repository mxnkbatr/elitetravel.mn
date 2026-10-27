import { EliteLogo } from "@/components/EliteLogo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <EliteLogo size="sm" />
          <p className="mt-2 text-sm text-muted">Explore. Dream. Discover.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link href="/tours" className="hover:text-accent">
            Аяллууд
          </Link>
          <Link href="/destinations" className="hover:text-accent">
            Чиглэл
          </Link>
          <Link href="/about" className="hover:text-accent">
            Бидний тухай
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Холбоо
          </Link>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Elite Travel Mongolia</p>
      </div>
    </footer>
  );
}
