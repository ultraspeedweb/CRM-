import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import { signIn, signUp } from "./actions";

type Props = { searchParams: Promise<{ error?: string; message?: string; mode?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const signUpMode = params.mode === "signup";

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="visual-orb orb-one" />
        <div className="visual-orb orb-two" />
        <div className="auth-story">
          <div className="logo-lockup"><span className="brand-mark">S</span><strong>SatışDesk</strong></div>
          <div className="eyebrow"><Sparkles size={15} /> مركز قيادة المبيعات</div>
          <h1>حوّل كل محادثة<br />إلى فرصة واضحة.</h1>
          <p>CRM متعدد اللغات يجمع العملاء، الرسائل، المتابعات والصفقات في مكان واحد—معزول وآمن لكل مؤسسة.</p>
          <div className="language-row"><span>العربية</span><span>Türkçe</span><span>English</span></div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card wide">
          <div className="mobile-brand"><span className="brand-mark">S</span><strong>SatışDesk</strong></div>
          <p className="kicker">{signUpMode ? "ابدأ مؤسستك" : "أهلًا بعودتك"}</p>
          <h2>{signUpMode ? "إنشاء حساب جديد" : "تسجيل الدخول"}</h2>
          <p className="muted">{signUpMode ? "جهّز مساحة فريقك خلال دقيقة" : "ادخل إلى مركز قيادة المبيعات"}</p>
          {params.error && <div className="alert error">{params.error}</div>}
          {params.message && <div className="alert success">{params.message}</div>}
          <form className="stack-form" action={signUpMode ? signUp : signIn}>
            {signUpMode && <label>الاسم الكامل<input name="fullName" autoComplete="name" placeholder="اسمك" required /></label>}
            <label>البريد الإلكتروني<div className="input-icon"><Mail size={17} /><input name="email" type="email" autoComplete="email" placeholder="name@company.com" dir="ltr" required /></div></label>
            <label>كلمة المرور<div className="input-icon"><LockKeyhole size={17} /><input name="password" type="password" minLength={signUpMode ? 10 : 8} autoComplete={signUpMode ? "new-password" : "current-password"} placeholder="••••••••••" dir="ltr" required /></div>{signUpMode && <small>10 أحرف على الأقل، بينها حروف وأرقام</small>}</label>
            <button className="primary-button" type="submit">{signUpMode ? "إنشاء الحساب" : "دخول آمن"}</button>
          </form>
          <a className="text-link" href={signUpMode ? "/login" : "/login?mode=signup"}>{signUpMode ? "لديك حساب؟ سجّل الدخول" : "أول مرة؟ أنشئ حساب مؤسستك"}</a>
        </div>
      </section>
    </main>
  );
}
