import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";

const words = {
  ar: { title:"بدء استخدام شركتك", sub:"خطوات فعلية لتجهيز SatışDesk لفريق المبيعات. يتم تحديث حالة كل خطوة من بيانات شركتك.", ready:"مكتمل", waiting:"التالي", account:"إنشاء مساحة الشركة", team:"إعداد الفريق", customer:"إضافة أول عميل محتمل", deal:"إنشاء أول صفقة", follow:"تنظيم أول متابعة", channels:"ربط قناة واتساب", plan:"تفعيل الباقة التجارية", accountHint:"مساحة عملك جاهزة.", teamHint:"أضف موظفين بعد اعتماد صلاحيات الدعوات.", customerHint:"ابدأ ببناء قائمة عملائك المصرّح بها.", dealHint:"تابع رحلة البيع من فرصة إلى صفقة.", followHint:"ضع خطوة متابعة واضحة للعميل.", channelsHint:"يتطلب رقماً تجارياً وتفويض Meta؛ لا تُرسل رسائل تجريبية إلى عملاء حقيقيين.", planHint:"التفعيل التجاري يعتمد على عرض وعقد وفاتورة معتمدة؛ لا يوجد تحصيل تلقائي.", action:"انتقل", note:"لا تعني هذه القائمة أن الخدمة مدفوعة أو أن واتساب معتمد. كل شركة لها بياناتها وصلاحياتها المستقلة." },
  tr: { title:"Şirketinizi kullanmaya başlayın",sub:"SatışDesk satış ekibiniz için somut kurulum adımları. Durumlar şirket verilerinize dayanır.",ready:"Tamamlandı",waiting:"Sonraki adım",account:"Şirket alanı",team:"Ekibi hazırlayın",customer:"İlk müşteri adayını ekleyin",deal:"İlk fırsatı oluşturun",follow:"İlk takibi planlayın",channels:"WhatsApp kanalını bağlayın",plan:"Ticari planı etkinleştirin",accountHint:"Şirket alanınız hazır.",teamHint:"Davet yetkileri onaylandıktan sonra çalışanları ekleyin.",customerHint:"Yalnızca yetkili müşteri kayıtlarını ekleyin.",dealHint:"Satış fırsatlarınızı yönetin.",followHint:"Takip için net bir sonraki adım belirleyin.",channelsHint:"İşletme numarası ve Meta onayı gerekir.",planHint:"Yazılı teklif, sözleşme ve faturayla etkinleşir; otomatik ücret alınmaz.",action:"Aç",note:"Bu kontrol listesi ücretli abonelik veya WhatsApp onayı anlamına gelmez. Şirket verileri ayrıdır." },
  en: { title:"Set up your workspace",sub:"Actionable steps to get your team ready. Completion reflects your own company data.",ready:"Completed",waiting:"Next step",account:"Company workspace",team:"Prepare your team",customer:"Add your first lead",deal:"Create your first deal",follow:"Schedule a follow-up",channels:"Connect WhatsApp",plan:"Activate commercial plan",accountHint:"Your workspace is ready.",teamHint:"Add team members after invitation permissions are available.",customerHint:"Only import authorized customer records.",dealHint:"Manage an opportunity through your pipeline.",followHint:"Set a clear next action for your customer.",channelsHint:"Requires a business number and Meta approval.",planHint:"Activation requires a written offer, contract and invoice; no automatic charge.",action:"Open",note:"This checklist does not certify a paid subscription or WhatsApp connection. Tenant data remains separate." },
} as const;

type Entitlement = { subscription_status: string; is_access_active: boolean };
type EntitlementRpc = { rpc(name: "get_subscription_entitlements", args: { p_organization_id: string }): Promise<{ data: unknown; error: unknown }> };

export default async function GettingStartedPage() {
  const [{ supabase, organizationId }, locale] = await Promise.all([requireWorkspace(), getLocale()]);
  const t = words[locale];
  const [members, leads, deals, followups, whatsapp, entitlements] = await Promise.all([
    supabase.from("organization_members").select("user_id", { count:"exact", head:true }).eq("organization_id",organizationId).eq("status","active"),
    supabase.from("leads").select("id", { count:"exact", head:true }).eq("organization_id",organizationId),
    supabase.from("deals").select("id", { count:"exact", head:true }).eq("organization_id",organizationId),
    supabase.from("follow_ups").select("id", { count:"exact", head:true }).eq("organization_id",organizationId),
    supabase.from("whatsapp_connections").select("id", { count:"exact", head:true }).eq("organization_id",organizationId).eq("status","active"),
    (supabase as unknown as EntitlementRpc).rpc("get_subscription_entitlements", { p_organization_id: organizationId }),
  ]);
  const subscription = !entitlements.error && Array.isArray(entitlements.data)
    ? (entitlements.data as Entitlement[]).find(row => row?.subscription_status === "active" && row.is_access_active === true)
    : undefined;
  // A failed count or entitlement check must never appear as a completed setup step.
  const steps = [
    { label:t.account, hint:t.accountHint, done:true, href:"/dashboard" },
    { label:t.team, hint:t.teamHint, done:!members.error && (members.count??0)>1, href:"/settings" },
    { label:t.customer, hint:t.customerHint, done:!leads.error && (leads.count??0)>0, href:"/leads" },
    { label:t.deal, hint:t.dealHint, done:!deals.error && (deals.count??0)>0, href:"/deals" },
    { label:t.follow, hint:t.followHint, done:!followups.error && (followups.count??0)>0, href:"/follow-ups" },
    { label:t.channels, hint:t.channelsHint, done:!whatsapp.error && (whatsapp.count??0)>0, href:"/conversations" },
    { label:t.plan, hint:t.planHint, done:Boolean(subscription), href:"/pricing" },
  ];
  return <main className="content"><PageHeader title={t.title} subtitle={t.sub}/>
    <section className="panel" style={{maxWidth:900,padding:24}}>
      <div className="cards-list">{steps.map((step,i)=><div key={step.label} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 0",borderBottom:i===steps.length-1?"none":"1px solid #e5e7eb"}}>
        {step.done?<CheckCircle2 size={22} color="#15803d"/>:<Circle size={22} color="#64748b"/>}
        <div style={{flex:1}}><strong>{step.label}</strong><p className="muted" style={{margin:"5px 0"}}>{step.hint}</p><small>{step.done?t.ready:t.waiting}</small></div>
        <Link href={step.href} className="secondary-button compact">{t.action}<ArrowRight size={14}/></Link>
      </div>)}</div>
    </section>
    <p className="muted" style={{maxWidth:900,marginTop:18}}><ShieldCheck size={16} style={{display:"inline",verticalAlign:"middle",marginInlineEnd:7}}/>{t.note}</p>
  </main>;
}
