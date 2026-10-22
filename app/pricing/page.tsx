import Link from "next/link";
import { Check } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, publicCopy } from "@/lib/i18n";

const plans = [
  { name: "Starter", monthly: "2,990 ₺", yearly: "29,900 ₺", users: 3 },
  { name: "Growth", monthly: "6,990 ₺", yearly: "69,900 ₺", users: 10, featured: true },
  { name: "Business", monthly: "12,990 ₺", yearly: "129,900 ₺", users: 25 },
  { name: "Enterprise", monthly: null, yearly: null, users: null },
] as const;

const previewNotice = { ar: "الأسعار المعروضة استرشادية وقيد الاعتماد. الاشتراك والدفع لا يتمان تلقائياً؛ العرض النهائي بعد تحديد الاحتياجات والتعاقد.", tr: "Listelenen fiyatlar henüz onaylanmamış gösterge fiyatlarıdır. Otomatik abonelik veya tahsilat yapılmaz; nihai teklif kapsam ve sözleşmeye bağlıdır.", en: "Displayed prices are indicative and not yet approved. No automatic subscription or charge; final terms require a scoped written proposal and contract." } as const;

export default async function PricingPage() {
  const locale = await getLocale();
  const copy = publicCopy[locale];
  return <main className="pricing-page"><nav className="landing-nav"><Link className="logo-lockup" href="/"><span className="brand-mark">S</span><strong>SatışDesk</strong></Link><div><LanguageSwitcher locale={locale} next="/pricing"/><Link className="secondary-button" href="/login">{copy.login}</Link></div></nav><header className="pricing-head"><span className="hero-pill">{copy.pricing}</span><h1>{copy.pricingTitle}</h1><p>{copy.pricingIntro}</p><p style={{maxWidth:750,margin:"18px auto",lineHeight:1.8,color:"#526b5a"}}>{previewNotice[locale]}</p></header><section className="pricing-grid">{plans.map((plan)=><article className={`plan-card ${"featured" in plan&&plan.featured?"featured":""}`} key={plan.name}><h2>{plan.name}</h2><strong>{plan.monthly??copy.custom}</strong>{plan.monthly&&<span>{copy.monthly}</span>}<p>{plan.yearly?`${plan.yearly} · ${copy.yearly}`:copy.enterprise}</p><div><Check size={17}/>{plan.users?`${plan.users} ${copy.users}`:copy.custom}</div><Link className="primary-button" href="/pilot">{plan.monthly?copy.choose:copy.enterprise}</Link></article>)}</section><p className="founding-note">{copy.founding} <Link href="/pilot">{copy.pilot}</Link></p></main>;
}
