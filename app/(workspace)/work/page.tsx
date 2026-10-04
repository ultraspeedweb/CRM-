import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, CheckCircle2, Flame, Target, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";
import { canUseExecutionSurface } from "@/lib/workspace-surfaces";

const copy = {
  ar:{title:"عملي اليوم",sub:"الأعمال ذات الأولوية التي تحتاج تنفيذك الآن.",overdue:"متأخر",upcoming:"قادم",hot:"فرصة مهمة",empty:"لا توجد أعمال عاجلة الآن",follow:"فتح المتابعة",calendar:"فتح الموعد",lead:"فتح العميل",progress:"تقدم التنفيذ",progressSub:"هذه المرحلة تستخدم بيانات العمل الحقيقية؛ ربط مساهمتك بهدف الشركة يأتي مع Goal Intelligence."},
  tr:{title:"Bugünkü işlerim",sub:"Şimdi yürütmeniz gereken en yüksek öncelikli işler.",overdue:"Gecikmiş",upcoming:"Yaklaşan",hot:"Önemli fırsat",empty:"Şu anda acil iş yok",follow:"Takibi aç",calendar:"Randevuyu aç",lead:"Müşteriyi aç",progress:"Yürütme ilerlemesi",progressSub:"Bu yüzey gerçek iş verisini kullanır; şirket hedefine katkı Goal Intelligence ile bağlanacaktır."},
  en:{title:"My work",sub:"The highest-priority work that needs your execution now.",overdue:"Overdue",upcoming:"Upcoming",hot:"Important opportunity",empty:"No urgent work right now",follow:"Open follow-up",calendar:"Open appointment",lead:"Open customer",progress:"Execution progress",progressSub:"This surface uses real work data; contribution to company goals is added by Goal Intelligence."}
} as const;

export default async function WorkPage(){
  const [{supabase,organizationId,membership},locale]=await Promise.all([requireWorkspace(),getLocale()]);
  if(!canUseExecutionSurface(membership.role)) redirect("/insights");
  const t=copy[locale]; const now=new Date(); const nowIso=now.toISOString(); const soon=new Date(now.getTime()+24*60*60*1000).toISOString();
  const [followups,appointments,hotLeads]=await Promise.all([
    supabase.from("follow_ups").select("id,subject,due_at,leads(id,full_name)").eq("organization_id",organizationId).in("status",["pending","in_progress"]).lt("due_at",nowIso).order("due_at").limit(8),
    supabase.from("appointments").select("id,title,starts_at,leads(id,full_name)").eq("organization_id",organizationId).in("status",["scheduled","confirmed"]).gte("starts_at",nowIso).lte("starts_at",soon).order("starts_at").limit(8),
    supabase.from("leads").select("id,full_name,score,created_at").eq("organization_id",organizationId).in("status",["new","contacted","qualified"]).gte("score",70).order("score",{ascending:false}).limit(6)
  ]);
  const tasks=[
    ...(followups.data??[]).map(x=>({id:`f-${x.id}`,rank:0,title:x.subject||t.overdue,label:t.overdue,href:"/follow-ups",cta:t.follow,time:x.due_at,Icon:Flame})),
    ...(appointments.data??[]).map(x=>({id:`a-${x.id}`,rank:1,title:x.title||t.upcoming,label:t.upcoming,href:"/appointments",cta:t.calendar,time:x.starts_at,Icon:CalendarClock})),
    ...(hotLeads.data??[]).map(x=>({id:`l-${x.id}`,rank:2,title:x.full_name,label:`${t.hot} · ${x.score}`,href:`/leads?lead=${x.id}`,cta:t.lead,time:x.created_at,Icon:UserRoundCheck}))
  ].sort((a,b)=>a.rank-b.rank||new Date(a.time).getTime()-new Date(b.time).getTime()).slice(0,12);
  return <main className="content"><PageHeader title={t.title} subtitle={t.sub}/>
    <section className="panel"><div className="panel-head"><div><h2>{t.title}</h2><p>{t.sub}</p></div><Target size={20}/></div><div className="cards-list">{tasks.map(item=><div className="task-row" key={item.id}><item.Icon size={18}/><div><strong>{item.title}</strong><small>{item.label}</small></div><time>{new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Istanbul"}).format(new Date(item.time))}</time><Link className="mini-action" href={item.href}>{item.cta}</Link></div>)}{!tasks.length?<div className="empty-state"><CheckCircle2 size={30}/><strong>{t.empty}</strong></div>:null}</div></section>
    <section className="panel"><div className="panel-head"><div><h2>{t.progress}</h2><p>{t.progressSub}</p></div><Target size={20}/></div></section>
  </main>;
}