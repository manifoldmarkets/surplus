"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/review", label: "Applications" },
  { href: "/review/ai", label: "AI Review" },
  { href: "/review/pangram", label: "Pangram" },
  { href: "/review/email", label: "Email" },
];

export function ReviewNav() {
  const pathname = usePathname();
  if (pathname === "/review/login") return null;
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink-dark bg-paper-deep">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-3 sm:px-6">
        <Link
          href="/review"
          className="font-display text-lg leading-none text-ink-blue misreg-pink"
        >
          SURPLUS
        </Link>
        <span className="-ml-4 mt-1 font-mono text-xs text-ink-dark/60">
          /review
        </span>
        <nav className="flex gap-1 font-condensed text-lg">
          {TABS.map((t) => {
            const active =
              t.href === "/review"
                ? pathname === "/review" || pathname.startsWith("/review/app")
                : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3 py-1 tracking-wide ${
                  active
                    ? "bg-ink-blue text-paper"
                    : "text-ink-dark hover:bg-ink-dark/10"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
