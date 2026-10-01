"use client";

import { useEffect, useState } from "react";

const copy = {
  ar: { title: "صار خطأ غير متوقع", body: "بياناتك آمنة. جرّب إعادة تحميل القسم.", retry: "إعادة المحاولة" },
  tr: { title: "Beklenmeyen bir hata oluştu", body: "Verileriniz güvende. Bölümü yeniden yüklemeyi deneyin.", retry: "Tekrar dene" },
  en: { title: "Something went wrong", body: "Your data is safe. Try reloading this section.", retry: "Try again" },
} as const;

type Locale = keyof typeof copy;

function readLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )satisdesk_locale=([^;]+)/);
  const saved = match?.[1];
  if (saved === "ar" || saved === "tr" || saved === "en") return saved;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("ar")) return "ar";
  if (browser.startsWith("tr")) return "tr";
  return "en";
}

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => setLocale(readLocale()), []);
  const t = copy[locale];

  return (
    <main className="center-page" dir={locale === "ar" ? "rtl" : "ltr"}>
      <section className="auth-card">
        <div className="brand-mark">S</div>
        <h1>{t.title}</h1>
        <p className="muted">{t.body}</p>
        <button className="primary-button" onClick={reset}>{t.retry}</button>
      </section>
    </main>
  );
}
