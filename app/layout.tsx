import type { Metadata } from "next";
import { Bowlby_One, Antonio, Newsreader, Inconsolata } from "next/font/google";
import "./globals.css";

const bowlby = Bowlby_One({
  variable: "--font-bowlby",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const antonio = Antonio({
  variable: "--font-antonio",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surplus — a software incubator",
  description:
    "A software incubator for massive public good in the age of transformative AI. Organized by Manifund & Lightcone. $100K + SAFE, 12 weeks, Berkeley.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bowlby.variable} ${antonio.variable} ${newsreader.variable} ${inconsolata.variable}`}
    >
      <body
        className="grain overflow-x-hidden bg-paper font-serif text-lg leading-normal text-ink-dark antialiased"
        data-palette="pink-blue"
      >
        {children}
      </body>
    </html>
  );
}
