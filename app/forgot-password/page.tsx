import { Mail } from "lucide-react";
import { requestPasswordReset } from "./actions";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  return <main className="auth-shell"><section className="auth-panel"><div className="auth-card wide"><p className="kicker">SatışDesk</p><h2>استعادة كلمة المرور</h2><p className="muted">أدخل بريدك الإلكتروني وسنرسل تعليمات الاستعادة إذا كان الحساب موجودًا.</p>{params.error&&<div className="alert error">{params.error}</div>}{params.message&&<div className="alert success">{params.message}</div>}<form className="stack-form" action={requestPasswordReset}><label>البريد الإلكتروني<div className="input-icon"><Mail size={17}/><input name="email" type="email" autoComplete="email" required dir="ltr"/></div></label><button className="primary-button" type="submit">إرسال رابط الاستعادة</button></form><a className="text-link" href="/login">العودة لتسجيل الدخول</a></div></section></main>;
}
