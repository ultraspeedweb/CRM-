import Link from "next/link";
import { getLocale } from "@/lib/i18n";

const copy = {
  ar: { title: "الصفحة غير موجودة", back: "العودة للوحة التحكم" },
  tr: { title: "Sayfa bulunamadı", back: "Kontrol paneline dön" },
  en: { title: "Page not found", back: "Back to dashboard" },
} as const;

export default async function NotFound() {
  const locale = await getLocale();
  const t = copy[locale];

  return (
    <main className="center-page">
      <section className="auth-card">
        <div className="brand-mark">S</div>
        <h1>{t.title}</h1>
        <Link className="primary-button" href="/dashboard">{t.back}</Link>
      </section>
    </main>
  );
}
