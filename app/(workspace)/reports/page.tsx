import { BarChart3, CircleDollarSign, Clock3, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";

export default async function ReportsPage(){
  const { supabase, organizationId } = await requireWorkspace();
  const now = new Date().toISOString();
  const [allLeads, wonDeals, activeDeals, overdue, sources] = await Promise.all([
    supabase.from("leads").select("id,status,source_channel").eq("organization_id", organizationId),
    supabase.from("deals").select("amount,currency").eq("organization_id", organizationId).eq("stage", "won"),
    supabase.from("deals").select("amount,currency,probability").eq("organization_id", organizationId).in("stage", ["qualification","proposal","negotiation"]),
    supabase.from("follow_ups").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).in("status", ["pending","in_progress"]).lt("due_at", now),
    supabase.from("leads").select("source_channel").eq("organization_id", organizationId),
  ]);
  const leads = allLeads.data ?? [];
  const wonLeadCount = leads.filter((lead) => lead.status === "won").length;
  const conversion = leads.length ? Math.round((wonLeadCount / leads.length) * 100) : 0;
  const wonTry = (wonDeals.data ?? []).filter((deal) => deal.currency === "TRY").reduce((sum, deal) => sum + Number(deal.amount ?? 0), 0);
  const weightedTry = (activeDeals.data ?? []).filter((deal) => deal.currency === "TRY").reduce((sum, deal) => sum + Number(deal.amount ?? 0) * Number(deal.probability ?? 0) / 100, 0);
  const sourceCounts = (sources.data ?? []).reduce<Record<string, number>>((acc, item) => { const key = item.source_channel ?? "manual"; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {});
  const topSource = Object.entries(sourceCounts).sort((a,b) => b[1]-a[1])[0];
  const metrics = [
    ["التحويل إلى فوز", `${conversion}%`, `${wonLeadCount} من ${leads.length} عميل`, Target],
    ["إيراد مغلق TRY", `${Intl.NumberFormat("tr-TR").format(wonTry)} ₺`, "صفقات won فقط", CircleDollarSign],
    ["المسار المرجّح TRY", `${Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(weightedTry)} ₺`, "حسب احتمال الإغلاق", TrendingUp],
    ["متابعات متأخرة", overdue.count ?? 0, "تحتاج إجراء اليوم", Clock3],
  ] as const;
  return <main className="content"><PageHeader title="التقارير" subtitle="مؤشرات تشغيلية حقيقية تساعدك تعرف أين تضيع المبيعات وأين نركّز اليوم."/>
    <section className="metrics-grid">{metrics.map(([label,value,note,Icon]) => <article className="metric-card" key={label}><div className="metric-icon green"><Icon size={21}/></div><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>)}</section>
    <section className="dashboard-grid"><article className="panel"><div className="panel-head"><div><h2>أفضل مصدر عملاء</h2><p>حسب عدد العملاء المسجلين</p></div><BarChart3 size={20}/></div>{topSource ? <div className="report-highlight"><strong>{topSource[0]}</strong><span>{topSource[1]} عميل</span></div> : <div className="empty-mini"><BarChart3 size={25}/><span>أدخل العملاء ليظهر أفضل مصدر</span></div>}</article>
    <article className="panel span-two"><div className="panel-head"><div><h2>قراءة المدير</h2><p>قرار واحد واضح بدل تقرير طويل</p></div><TrendingUp size={20}/></div><div className="manager-insight"><strong>{(overdue.count ?? 0) > 0 ? `ابدأ اليوم بإنقاذ ${overdue.count} متابعة متأخرة.` : "لا توجد متابعات متأخرة الآن."}</strong><p>{weightedTry > 0 ? `المسار المرجّح الحالي ${Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(weightedTry)} ₺؛ راقب الصفقات الأعلى احتمالًا وقيمة.` : "أضف الصفقات واحتمال الإغلاق ليحسب SatışDesk الأولوية المالية تلقائيًا."}</p></div></article></section>
  </main>;
}
