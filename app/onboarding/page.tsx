import { Building2, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createOrganization } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");
  const { data: membership } = await supabase.from("organization_members").select("organization_id").limit(1).maybeSingle();
  if (membership) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="center-page onboarding-bg">
      <section className="onboarding-card">
        <div className="step-badge">الخطوة 1 من 1</div>
        <div className="brand-mark"><Building2 size={26} /></div>
        <h1>جهّز مؤسسة SatışDesk</h1>
        <p className="muted">هذه المساحة معزولة تمامًا عن أي مشروع أو مؤسسة ثانية.</p>
        {params.error && <div className="alert error">{params.error}</div>}
        <form className="stack-form" action={createOrganization}>
          <label>اسمك الكامل<input name="fullName" placeholder="مثال: أحمد يلماز" required /></label>
          <label>اسم المؤسسة<input name="name" defaultValue="SatışDesk" placeholder="اسم شركتك" required /></label>
          <label>الرابط المختصر<input name="slug" defaultValue="satisdesk" placeholder="satisdesk" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" dir="ltr" required /><small>أحرف إنجليزية صغيرة وأرقام فقط</small></label>
          <button className="primary-button" type="submit">إنشاء مساحة العمل</button>
        </form>
        <div className="trust-row"><CheckCircle2 size={16} /> عزل بيانات · صلاحيات أدوار · سجل تدقيق</div>
      </section>
    </main>
  );
}
