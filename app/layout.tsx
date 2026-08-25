import type { Metadata } from "next";
import { Cairo, Manrope } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-latin" });

export const metadata: Metadata = {
  title: "SatışDesk | Sales Command Center",
  description: "Multilingual lead operations for modern sales teams",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
