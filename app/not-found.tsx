import Link from "next/link";
import { getLocale, localeMeta } from "@/lib/i18n";

const copy = {
  ar: { title: "الصفحة غير موجودة", body: "الرابط الذي طلبته غير متاح أو تم نقله.", back: "العودة للرئيسية" },
  tr: { title: "Sayfa bulunamadı", body: "İstediğiniz bağlantı kullanılamıyor veya taşınmış olabilir.", back: "Ana sayfaya dön" },
  en: { title: "Page not found", body: "The link you requested is unavailable or may have moved.", back: "Back to home" },
} as const;

export default async function NotFound() {
  const locale = await getLocale();
  const t = copy[locale];

  return (
    <main className="center-page" dir={localeMeta[locale].dir}>
      <section className="auth-card">
        <div className="brand-mark">S</div>
        <h1>{t.title}</h1>
        <p className="muted">{t.body}</p>
        <Link className="primary-button" href="/">{t.back}</Link>
      </section>
    </main>
  );
}
