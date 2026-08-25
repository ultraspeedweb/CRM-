import { Plus, UserRoundSearch } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";
import { createLead } from "../actions";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };
export default async function LeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase, organizationId } = await requireWorkspace();
  const { data: leads } = await supabase.from("leads").select("id, full_name, email, phone, status, score, source_channel, created_at").eq("organization_id", organizationId).order("created_at", { ascending: false });
  return <main className="content"><PageHeader title="العملاء" subtitle="كل فرصة بيع مع مصدرها، حالتها والنتيجة الحالية." />{params.error && <div className="alert error">{params.error}</div>}{params.success && <div className="alert success">{params.success}</div>}
    <section className="split-view"><article id="new" className="panel form-panel"><div className="panel-head"><div><h2>إضافة عميل</h2><p>سجل سريع، وكمل التفاصيل لاحقًا</p></div><Plus size={20} /></div><form className="stack-form" action={createLead}><label>اسم العميل<input name="fullName" required placeholder="الاسم الكامل" /></label><label>رقم الهاتف<input name="phone" dir="ltr" placeholder="+90 ..." /></label><label>البريد الإلكتروني<input name="email" type="email" dir="ltr" placeholder="name@example.com" /></label><label>المصدر<select name="sourceChannel" defaultValue="manual"><option value="manual">إدخال يدوي</option><option value="whatsapp">WhatsApp</option><option value="web">الموقع</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="referral">إحالة</option></select></label><button className="primary-button" type="submit">حفظ العميل</button></form></article>
    <article className="panel grow"><div className="panel-head"><div><h2>قائمة العملاء</h2><p>{leads?.length ?? 0} سجل</p></div><UserRoundSearch size={20} /></div><div className="cards-list">{(leads ?? []).map((lead) => <div className="lead-row" key={lead.id}><div className="person"><span>{lead.full_name.slice(0,1)}</span><div><strong>{lead.full_name}</strong><small>{lead.phone || lead.email || "بدون معلومات اتصال"}</small></div></div><div className="lead-meta"><span className={`status ${lead.status}`}>{lead.status}</span><b>{lead.score}/100</b></div></div>)}{!leads?.length && <div className="empty-state"><UserRoundSearch size={30} /><strong>القائمة فارغة</strong><span>أضف أول عميل من النموذج.</span></div>}</div></article></section>
  </main>;
}
