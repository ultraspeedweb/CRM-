import { AlarmClockPlus, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";
import { completeFollowUp, createFollowUp } from "../actions";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };
export default async function FollowUpsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase, organizationId: orgId } = await requireWorkspace();
  const now = new Date();
  const [items, leads] = await Promise.all([
    supabase.from("follow_ups").select("id,subject,due_at,status,follow_up_type,leads(full_name)").eq("organization_id", orgId).in("status", ["pending", "in_progress"]).order("due_at"),
    supabase.from("leads").select("id,full_name").eq("organization_id", orgId).order("full_name"),
  ]);
  const pending = items.data ?? [];
  const overdueCount = pending.filter((item) => new Date(item.due_at) < now).length;
  return <main className="content"><PageHeader title="المتابعات" subtitle="لا فرصة تضيع: المهام المتأخرة تظهر أولًا ويمكن إغلاقها فورًا." />{params.error && <div className="alert error">{params.error}</div>}{params.success && <div className="alert success">{params.success}</div>}
    {overdueCount > 0 && <div className="connector-notice"><AlarmClockPlus size={20}/><div><strong>{overdueCount} متابعة متأخرة تحتاج إجراء</strong><span>SatışDesk يضعها أمام الفريق حتى لا تضيع فرصة بيع بسبب النسيان.</span></div></div>}
    <section className="split-view"><article className="panel form-panel"><div className="panel-head"><div><h2>متابعة جديدة</h2><p>اربط المهمة بالعميل</p></div><AlarmClockPlus size={20} /></div><form className="stack-form" action={createFollowUp}><label>العميل<select name="leadId" required defaultValue=""><option value="" disabled>اختر العميل</option>{(leads.data ?? []).map((lead) => <option key={lead.id} value={lead.id}>{lead.full_name}</option>)}</select></label><label>الموضوع<input name="subject" required placeholder="اتصال لمراجعة العرض" /></label><label>موعد الاستحقاق<input name="dueAt" type="datetime-local" required /></label><button className="primary-button" type="submit">جدولة المتابعة</button></form></article>
    <article className="panel grow"><div className="panel-head"><div><h2>قائمة العمل</h2><p>{pending.length} مهمة مفتوحة</p></div><CheckCircle2 size={20} /></div><div className="cards-list">{pending.map((item) => { const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads; const overdue = new Date(item.due_at) < now; return <div className="task-row" key={item.id}><span className={`task-dot ${overdue ? "overdue" : item.status}`} /><div><strong>{item.subject || item.follow_up_type}</strong><small>{lead?.full_name ?? "عميل"}{overdue ? " · متأخرة" : ""}</small></div><time>{new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.due_at))}</time><form action={completeFollowUp}><input type="hidden" name="followUpId" value={item.id}/><button className="mini-action" type="submit">تم</button></form></div>})}{!pending.length && <div className="empty-state"><CheckCircle2 size={30} /><strong>كل شيء منجز</strong><span>لا توجد متابعات معلّقة.</span></div>}</div></article></section></main>;
}
