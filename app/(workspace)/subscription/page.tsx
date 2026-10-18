import { requestCommercialActivation } from "./actions";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";

type Entitlement = {
  plan_id: string;
  subscription_status: string;
  billing_cycle: string;
  included_users: number;
  current_period_end: string | null;
  trial_ends_at: string | null;
  is_access_active: boolean;
};
type EntitlementClient = {
  rpc(name: "get_subscription_entitlements", args: { p_organization_id: string }): Promise<{ data: unknown; error: unknown }>;
};
const copy = {
  ar: { title:"اشتراك شركتك", sub:"حالة الباقة والصلاحيات الفعلية من الخادم.", unavailable:"تعذر قراءة الاشتراك حالياً. لم نغيّر أي صلاحيات أو مبالغ.", none:"لا توجد باقة تجارية مفعلة لهذه الشركة بعد.", status:"الحالة", plan:"الباقة", cycle:"دورة الفوترة", seats:"المستخدمون المشمولون", until:"نهاية الفترة", trial:"نهاية التجربة", access:"إتاحة الخدمة", active:"متاح", inactive:"غير متاح", view:"عرض الأسعار الاسترشادية", pilot:"طلب تقييم تجاري وخطة تفعيل", note:"هذه شاشة قراءة فقط؛ لا تُنشئ اشتراكاً ولا تطلب دفعاً. يُفعّل الاشتراك حصراً بعد عقد وفاتورة وتأكيد تحصيل معتمد." },
  tr: { title:"Şirket aboneliğiniz",sub:"Sunucudan doğrulanan plan ve erişim bilgileri.",unavailable:"Abonelik durumu okunamadı. Herhangi bir ücret veya yetki değiştirilmedi.",none:"Bu şirket için etkin ticari abonelik henüz bulunmuyor.",status:"Durum",plan:"Paket",cycle:"Faturalama dönemi",seats:"Dahil kullanıcı",until:"Dönem sonu",trial:"Deneme sonu",access:"Hizmet erişimi",active:"Erişilebilir",inactive:"Erişilemiyor",view:"Gösterge fiyatları",pilot:"Ticari değerlendirme ve kurulum talebi",note:"Bu sayfa yalnızca bilgileri gösterir; abonelik veya ödeme oluşturmaz. Aktivasyon yazılı sözleşme, fatura ve doğrulanmış tahsilat gerektirir." },
  en: { title:"Your subscription",sub:"Server-verified plan and access status for your company.",unavailable:"Subscription state is temporarily unavailable. No charge or permission was changed.",none:"No activated commercial subscription exists for this company yet.",status:"Status",plan:"Plan",cycle:"Billing cycle",seats:"Included seats",until:"Current period ends",trial:"Trial ends",access:"Service access",active:"Allowed",inactive:"Not allowed",view:"View indicative pricing",pilot:"Request commercial assessment",note:"Read-only subscription information. This page never creates a subscription or collects payment. Activation requires an approved agreement, invoice and verified collection." },
} as const;

function isEntitlement(value: unknown): value is Entitlement {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return typeof e.plan_id === "string" && typeof e.subscription_status === "string" && typeof e.is_access_active === "boolean";
}
export default async function SubscriptionPage({searchParams}:{searchParams:Promise<{result?:string}>}) {
  const [{ supabase, organizationId }, locale] = await Promise.all([requireWorkspace(), getLocale()]);
  const t = copy[locale];
  const result=(await searchParams).result;
  const { membership } = await requireWorkspace();
  const canRequest=["owner","admin"].includes(membership.role);
  const { data, error } = await (supabase as unknown as EntitlementClient).rpc("get_subscription_entitlements", { p_organization_id: organizationId });
  const rows = !error && Array.isArray(data) ? data.filter(isEntitlement) : [];
  const current = rows[0];
  type RequestRow = { id:string;desired_plan:string;status:string;created_at:string };
  type IntakeReader = { from(name:"commercial_activation_requests"): { select(columns:string): { eq(column:string,value:string): { order(column:string,options:{ascending:boolean}): { limit(count:number): Promise<{data:RequestRow[]|null;error:unknown}> } } } } };
  const requests = await (supabase as unknown as IntakeReader).from("commercial_activation_requests").select("id,desired_plan,status,created_at").eq("organization_id",organizationId).order("created_at",{ascending:false}).limit(5);
  const openRequest = !requests.error && requests.data?.some(q=>["submitted","in_review","quoted"].includes(q.status));
  const items = current ? [
    [t.plan, current.plan_id],
    [t.status, current.subscription_status],
    [t.cycle, current.billing_cycle ?? "—"],
    [t.seats, String(current.included_users ?? "—")],
    [t.until, current.current_period_end ? new Date(current.current_period_end).toLocaleDateString(locale) : "—"],
    [t.trial, current.trial_ends_at ? new Date(current.trial_ends_at).toLocaleDateString(locale) : "—"],
    [t.access, current.is_access_active ? t.active : t.inactive],
  ] : [];
  return <main className="content"><PageHeader title={t.title} subtitle={t.sub}/>
    <section className="panel" style={{maxWidth:830,padding:24}}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}><CreditCard size={24}/><strong>{t.title}</strong></div>
      {error ? <p role="alert">{t.unavailable}</p> : !current ? <p>{t.none}</p> :
        <dl style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:20}}>
          {items.map(([label,value])=><div key={label}><dt className="muted">{label}</dt><dd style={{margin:0,fontWeight:600}}>{value}</dd></div>)}
        </dl>}
      {!requests.error && Boolean(requests.data?.length) && <section style={{marginTop:24}}><h2>{locale==="ar"?"طلبات التفعيل":locale==="tr"?"Aktivasyon talepleri":"Activation requests"}</h2><ul>{requests.data?.map(q=><li key={q.id}>{q.desired_plan} · {q.status} · {new Date(q.created_at).toLocaleDateString(locale)}</li>)}</ul></section>}
      {canRequest && !openRequest && <form action={requestCommercialActivation} className="stack-form" style={{marginTop:28,maxWidth:540}}>
        <h2>{locale==="ar"?"طلب تفعيل تجاري":locale==="tr"?"Ticari aktivasyon talebi":"Request commercial activation"}</h2>
        {result && <p role="status">{({submitted:"تم إرسال طلبك للمراجعة؛ لا يوجد تحصيل أو اشتراك تلقائي.",existing:"يوجد طلب مفتوح مسبقاً لشركتك.",invalid:"تحقق من البيانات المدخلة.",failed:"تعذر حفظ الطلب، حاول لاحقاً.",forbidden:"لا تملك صلاحية تقديم الطلب."} as Record<string,string>)[result] ?? ""}</p>}
        <label>{locale==="ar"?"البريد للتواصل":locale==="tr"?"İletişim e-postası":"Contact email"}<input type="email" name="email" required maxLength={254}/></label>
        <label>{locale==="ar"?"الباقة المطلوبة":locale==="tr"?"İstenen paket":"Requested plan"}<select name="plan" required><option value="pilot">Pilot</option><option value="starter">Starter</option><option value="growth">Growth</option><option value="business">Business</option><option value="enterprise">Enterprise</option></select></label>
        <label>{locale==="ar"?"الاحتياج (اختياري)":locale==="tr"?"İhtiyaçlar (isteğe bağlı)":"Requirements (optional)"}<textarea name="notes" maxLength={1000} rows={3}/></label>
        <button className="primary-button" type="submit">{locale==="ar"?"إرسال طلب المراجعة":locale==="tr"?"İnceleme talebi gönder":"Submit for review"}</button>
      </form>}
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}><Link href="/pilot" className="primary-button">{t.pilot}</Link><Link href="/pricing" className="secondary-button">{t.view}</Link></div>
    </section>
    <p className="muted" style={{maxWidth:830,marginTop:18}}><ShieldCheck size={16} style={{display:"inline",verticalAlign:"middle",marginInlineEnd:7}}/>{t.note}</p>
  </main>;
}
