import type { Metadata } from "next";
import { ReviewNav } from "@/app/review/nav";

export const metadata: Metadata = {
  title: "Surplus review",
  robots: { index: false, follow: false },
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-base text-ink-dark">
      <ReviewNav />
      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">{children}</div>
    </div>
  );
}
