import Link from "next/link";
import { ArrowLeft, CalendarClock, CircleDollarSign, MessageCircleMore, TrendingUp, UserPlus, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";

const statusLabel: Record<string, string> = { new: "جديد", contacted: "تم التواصل", qualified: "مؤهل", appointment: "موعد", negotiation: "تفاوض", won: "مغلق بنجاح", lost: "مفقود", disqualified: "غير مؤهل" };

export default async function DashboardPage() {
  const { supabase, organizationId: orgId } = await requireWorkspace();
  const [leadsCount, qualifiedCount, openConversations, pipeline, recentLeads, upcoming, overdueFollowUps] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("organization_id", orgId).in("status", ["qualified", "appointment", "negotiation"]),
    supabase.from("conversations").select("id", { count: "exact", head: true }).eq("organization_id", orgId).eq("status", "open"),
    supabase.from("deals").select("amount").eq("organization_id", orgId).neq("stage", "lost"),
    supabase.from("leads").select("id, full_name, status, score, source_channel, created_at").eq("organization_id", orgId).order("created_at", { ascending: false }).limit(6),
    supabase.from("appointments").select("id, title, starts_at, status, leads(full_name)").eq("organization_id", orgId).gte("starts_at", new Date().toISOString()).order("starts_at").limit(4),
    supabase.from("follow_ups").select("id", { count: "exact", head: true }).eq("organization_id", orgId).in("status", ["pending", "in_progress"]).lt("due_at", new Date().toISOString()),
  ]);
  const pipelineTotal = (pipeline.data ?? []).reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  const metrics = [
    ["إجمالي العملاء", leadsCount.count ?? 0, "هذا الشهر", UsersRound, "blue"],
    ["عملاء مؤهلون", qualifiedCount.count ?? 0, "جاهزون للمتابعة", TrendingUp, "green"],
    ["متابعات متأخرة", overdueFollowUps.count ?? 0, "فرص تحتاج إنقاذ", CalendarClock, "amber"],
    ["محادثات مفتوحة", openConversations.count ?? 0, "تحتاج ردًا", MessageCircleMore, "violet"],
    ["قيمة المسار", `${Intl.NumberFormat("ar", { notation: "compact" }).format(pipelineTotal)} ₺`, "الصفقات النشطة", CircleDollarSign, "amber"],
  ] as const;

  return <main className="content"><PageHeader title="صباح الخير 👋" subtitle="هذه صورة فريقك الآن، من أول رسالة حتى إغلاق الصفقة." action={<Link href="/leads#new" className="primary-button compact"><UserPlus size={17} /> عميل جديد</Link>} />
    <section className="metrics-grid">{metrics.map(([label, value, note, Icon, tone]) => <article className="metric-card" key={label}><div className={`metric-icon ${tone}`}><Icon size={21} /></div><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>)}</section>
    <section className="dashboard-grid">
      <article className="panel span-two"><div className="panel-head"><div><h2>أحدث العملاء</h2><p>الأولوية حسب النتيجة وآخر نشاط</p></div><Link href="/leads">عرض الكل <ArrowLeft size={15} /></Link></div>
        <div className="table-wrap"><table><thead><tr><th>العميل</th><th>المصدر</th><th>الحالة</th><th>النتيجة</th></tr></thead><tbody>{(recentLeads.data ?? []).map((lead) => <tr key={lead.id}><td><div className="person"><span>{lead.full_name.slice(0,1)}</span><strong>{lead.full_name}</strong></div></td><td>{lead.source_channel ?? "يدوي"}</td><td><span className={`status ${lead.status}`}>{statusLabel[lead.status] ?? lead.status}</span></td><td><div className="score"><i style={{ width: `${lead.score}%` }} /> <b>{lead.score}</b></div></td></tr>)}{!recentLeads.data?.length && <tr><td colSpan={4}><div className="empty-state"><UsersRound size={28} /><strong>ابدأ بإضافة أول عميل</strong><span>ستظهر رحلة المبيعات هنا مباشرة.</span></div></td></tr>}</tbody></table></div>
      </article>
      <article className="panel"><div className="panel-head"><div><h2>المواعيد القادمة</h2><p>بتوقيت إسطنبول</p></div><CalendarClock size={20} /></div><div className="timeline">{(upcoming.data ?? []).map((item) => { const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads; return <div className="timeline-item" key={item.id}><time>{new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.starts_at))}</time><div><strong>{item.title}</strong><span>{lead?.full_name ?? "عميل"}</span></div></div> })}{!upcoming.data?.length && <div className="empty-mini"><CalendarClock size={25} /><span>لا توجد مواعيد قادمة</span></div>}</div><Link href="/appointments" className="secondary-button">فتح التقويم</Link></article>
    </section>
  </main>;
}
