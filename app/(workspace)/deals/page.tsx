import { CircleDollarSign, HandCoins, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";
import { createDeal } from "../actions";

const stages = ["qualification", "proposal", "negotiation", "won"];
const labels: Record<string,string> = { qualification: "تأهيل", proposal: "عرض", negotiation: "تفاوض", won: "مغلقة" };
type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function DealsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase, organizationId } = await requireWorkspace();
  const [dealsResult, leads] = await Promise.all([
    supabase.from("deals").select("id,title,stage,amount,currency,probability,leads(full_name)").eq("organization_id", organizationId).neq("stage", "lost"),
    supabase.from("leads").select("id,full_name").eq("organization_id", organizationId).order("full_name"),
  ]);
  const deals = dealsResult.data ?? [];

  return <main className="content"><PageHeader title="الصفقات" subtitle="مسار بصري من التأهيل حتى الإغلاق." />
    {params.error && <div className="alert error">{params.error}</div>}{params.success && <div className="alert success">{params.success}</div>}
    <section className="panel deal-create"><div className="panel-head"><div><h2>صفقة جديدة</h2><p>حوّل العميل المؤهل إلى قيمة داخل المسار</p></div><Plus size={20} /></div><form className="inline-form" action={createDeal}>
      <select name="leadId" required defaultValue=""><option value="" disabled>العميل</option>{(leads.data ?? []).map((lead) => <option key={lead.id} value={lead.id}>{lead.full_name}</option>)}</select>
      <input name="title" required placeholder="عنوان الصفقة" />
      <input name="amount" type="number" min="0" step="0.01" required placeholder="القيمة" />
      <select name="currency" defaultValue="TRY"><option>TRY</option><option>USD</option><option>EUR</option></select>
      <select name="stage" defaultValue="qualification"><option value="qualification">تأهيل</option><option value="proposal">عرض</option><option value="negotiation">تفاوض</option><option value="won">مغلقة</option></select>
      <input name="probability" type="number" min="0" max="100" defaultValue="20" aria-label="احتمال الإغلاق" />
      <button className="primary-button" type="submit" disabled={!leads.data?.length}>إضافة</button>
    </form></section>
    <section className="kanban">{stages.map((stage) => { const stageDeals = deals.filter((deal) => deal.stage === stage); return <article className="kanban-column" key={stage}><header><span>{labels[stage]}</span><b>{stageDeals.length}</b></header><div>{stageDeals.map((deal) => { const lead = Array.isArray(deal.leads) ? deal.leads[0] : deal.leads; return <section className="deal-card" key={deal.id}><div className="deal-icon"><HandCoins size={18} /></div><strong>{deal.title}</strong><span>{lead?.full_name ?? "عميل"}</span><footer><b>{Intl.NumberFormat("tr-TR").format(Number(deal.amount ?? 0))} {deal.currency}</b><small>{deal.probability}%</small></footer></section>})}{!stageDeals.length && <div className="kanban-empty"><CircleDollarSign size={22} /><span>لا صفقات</span></div>}</div></article>})}</section>
  </main>;
}
