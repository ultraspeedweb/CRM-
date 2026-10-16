import { Building2, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createOrganization } from "./actions";
import { getLocale } from "@/lib/i18n";

const copy = {
 ar:{step:"إنشاء مساحة العمل",title:"أنشئ مساحة شركتك",intro:"أدخل بيانات شركتك الفعلية. ستبقى بياناتها منفصلة عن بقية الشركات.",person:"اسمك الكامل",company:"اسم الشركة",slug:"الرابط المختصر",slugHelp:"حروف إنجليزية صغيرة وأرقام وشرطات، ويمكن تركيبه من اسم شركتك.",button:"إنشاء مساحة شركتي",trust:"عزل بيانات · صلاحيات · سجل تدقيق"},
 tr:{step:"Çalışma alanı kurulumu",title:"Şirket alanınızı oluşturun",intro:"Gerçek şirket bilgilerinizi girin. Şirket verileri diğer kuruluşlardan ayrı tutulur.",person:"Ad soyad",company:"Şirket adı",slug:"Kısa adres",slugHelp:"Küçük Latin harfleri, rakamlar ve kısa çizgiler kullanın.",button:"Şirket alanını oluştur",trust:"Veri izolasyonu · Roller · Denetim kayıtları"},
 en:{step:"Workspace setup",title:"Create your company workspace",intro:"Enter your real business details. Your company data remains isolated from other organizations.",person:"Full name",company:"Company name",slug:"Short address",slugHelp:"Use lowercase letters, numbers and hyphens.",button:"Create company workspace",trust:"Tenant isolation · Roles · Audit trail"}
} as const;

type Props = { searchParams: Promise<{ error?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/login");
  const { data: membership } = await supabase.from("organization_members").select("organization_id").limit(1).maybeSingle();
  if (membership) redirect("/dashboard");
  const params = await searchParams;
  const t = copy[await getLocale()];

  return (
    <main className="center-page onboarding-bg">
      <section className="onboarding-card">
        <div className="step-badge">{t.step}</div>
        <div className="brand-mark"><Building2 size={26} /></div>
        <h1>{t.title}</h1>
        <p className="muted">{t.intro}</p>
        {params.error && <div className="alert error">{params.error}</div>}
        <form className="stack-form" action={createOrganization}>
          <label>{t.person}<input name="fullName" placeholder="مثال: أحمد يلماز" required /></label>
          <label>{t.company}<input name="name" placeholder="اسم شركتك" required /></label>
          <label>{t.slug}<input name="slug" placeholder="satisdesk" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" dir="ltr" required /><small>{t.slugHelp}</small></label>
          <button className="primary-button" type="submit">{t.button}</button>
        </form>
        <div className="trust-row"><CheckCircle2 size={16} /> {t.trust}</div>
      </section>
    </main>
  );
}
