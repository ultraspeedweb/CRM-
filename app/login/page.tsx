import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, publicCopy } from "@/lib/i18n";
import { signIn, signUp } from "./actions";

type Props = { searchParams: Promise<{ error?: string; message?: string; mode?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const signUpMode = params.mode === "signup";
  const locale = await getLocale();
  const copy = publicCopy[locale];
  return <main className="auth-shell"><section className="auth-visual"><div className="visual-orb orb-one"/><div className="visual-orb orb-two"/><div className="auth-story"><div className="logo-lockup"><span className="brand-mark">S</span><strong>SatışDesk</strong></div><div className="eyebrow"><Sparkles size={15}/>{copy.authEyebrow}</div><h1>{copy.authTitle}</h1><p>{copy.authIntro}</p><LanguageSwitcher locale={locale} next={signUpMode?"/login?mode=signup":"/login"}/></div></section>
    <section className="auth-panel"><div className="auth-card wide"><div className="mobile-brand"><span className="brand-mark">S</span><strong>SatışDesk</strong></div><p className="kicker">{signUpMode?copy.startOrg:copy.welcome}</p><h2>{signUpMode?copy.signUp:copy.signIn}</h2><p className="muted">{signUpMode?copy.authSignUpHint:copy.authSignInHint}</p>{params.error&&<div className="alert error">{params.error}</div>}{params.message&&<div className="alert success">{params.message}</div>}<form className="stack-form" action={signUpMode?signUp:signIn}>{signUpMode&&<label>{copy.fullName}<input name="fullName" autoComplete="name" required/></label>}<label>{copy.email}<div className="input-icon"><Mail size={17}/><input name="email" type="email" autoComplete="email" placeholder="name@company.com" dir="ltr" required/></div></label><label>{copy.password}<div className="input-icon"><LockKeyhole size={17}/><input name="password" type="password" minLength={signUpMode?10:8} autoComplete={signUpMode?"new-password":"current-password"} placeholder="••••••••••" dir="ltr" required/></div>{signUpMode&&<small>{copy.passwordHint}</small>}</label><button className="primary-button" type="submit">{signUpMode?copy.createAccount:copy.secureLogin}</button></form><a className="text-link" href={signUpMode?"/login":"/login?mode=signup"}>{signUpMode?copy.hasAccount:copy.firstTime}</a></div></section></main>;
}
