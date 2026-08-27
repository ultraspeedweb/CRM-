import type { Metadata } from "next";
import { Cairo, Manrope } from "next/font/google";
import { getLocale, localeMeta } from "@/lib/i18n";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-latin" });

export const metadata: Metadata = {
  title: "SatışDesk | Sales Command Center",
  description: "Multilingual lead operations for modern sales teams",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={localeMeta[locale].dir} className={`${cairo.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
