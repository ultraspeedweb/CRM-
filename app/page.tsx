import Link from "next/link";
import { ArrowLeft, Check, Globe2, MessageCircleMore, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, publicCopy } from "@/lib/i18n";

const icons = [MessageCircleMore, Globe2, TrendingUp, ShieldCheck] as const;

export default async function Home() {
  const locale = await getLocale();
  const copy = publicCopy[locale];
  return <main className="landing">
    <nav className="landing-nav"><Link className="logo-lockup" href="/"><span className="brand-mark">S</span><strong>SatışDesk</strong></Link><div><LanguageSwitcher locale={locale} next="/"/><Link href="/pricing">{copy.pricing}</Link><a href="#pilot">{copy.pilot}</a><Link className="secondary-button" href="/login">{copy.login}</Link></div></nav>
    <section className="landing-hero"><div className="hero-copy"><span className="hero-pill"><Sparkles size={15}/>{copy.pill}</span><h1>{copy.title}</h1><p>{copy.intro}</p><div className="hero-actions"><Link className="primary-button" href="/login?mode=signup">{copy.start}<ArrowLeft size={17}/></Link><a className="secondary-button" href="#how">{copy.how}</a></div><div className="hero-proof"><span><Check size={15}/>{copy.quick}</span><span><Check size={15}/>{copy.flexible}</span><span><Check size={15}/>{copy.transparent}</span></div></div>
      <div className="hero-console"><header><span/><span/><span/><b>LIVE SALES FLOW</b></header>{copy.outcomes.slice(0,3).map(([title,text],index)=>{const Icon=icons[index];return <div className={`flow-step ${index===0?"active":index===2?"success":""}`} key={title}><Icon size={19}/><div><strong>{title}</strong><small>{text}</small></div></div>;})}</div></section>
    <section id="how" className="landing-section"><div className="section-heading"><span>{copy.why}</span><h2>{copy.operating}</h2><p>{copy.simple}</p></div><div className="outcome-grid">{copy.outcomes.map(([title,text],index)=>{const Icon=icons[index];return <article key={title}><Icon size={23}/><h3>{title}</h3><p>{text}</p></article>;})}</div></section>
    <section id="pilot" className="pilot-section"><div><span className="hero-pill">FOUNDING PILOT</span><h2>{copy.pilotTitle}</h2><p>{copy.pilotText}</p></div><article className="price-card"><span>{copy.setupMonth}</span><strong>50,000 ₺</strong><small>{copy.pilotNote}</small><Link className="primary-button" href="/login?mode=signup">{copy.reserve}<ArrowLeft size={17}/></Link></article></section>
    <footer className="landing-footer"><div className="logo-lockup"><span className="brand-mark">S</span><strong>SatışDesk</strong></div><p>Built for multilingual sales teams in Türkiye &amp; MENA.</p><Link href="/login">{copy.teamLogin}</Link></footer>
  </main>;
}
