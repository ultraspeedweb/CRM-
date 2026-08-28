import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale, next }: { locale: Locale; next: string }) {
  return <div className="language-switcher" aria-label="Language">{(["ar", "tr", "en"] as const).map((item) => <a className={item === locale ? "active" : ""} href={`/api/locale?locale=${item}&next=${encodeURIComponent(next)}`} key={item}>{item.toUpperCase()}</a>)}</div>;
}
