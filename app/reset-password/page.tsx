import { LockKeyhole } from "lucide-react";
import { updatePassword } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  return <main className="auth-shell"><section className="auth-panel"><div className="auth-card wide"><p className="kicker">SatışDesk</p><h2>تعيين كلمة مرور جديدة</h2><p className="muted">استخدم كلمة مرور قوية من 10 أحرف على الأقل وتحتوي حروفًا وأرقامًا.</p>{params.error&&<div className="alert error">{params.error}</div>}<form className="stack-form" action={updatePassword}><label>كلمة المرور الجديدة<div className="input-icon"><LockKeyhole size={17}/><input name="password" type="password" minLength={10} autoComplete="new-password" required/></div></label><label>تأكيد كلمة المرور<div className="input-icon"><LockKeyhole size={17}/><input name="confirm" type="password" minLength={10} autoComplete="new-password" required/></div></label><button className="primary-button" type="submit">حفظ كلمة المرور</button></form></div></section></main>;
}
