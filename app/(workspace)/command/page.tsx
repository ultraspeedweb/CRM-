import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, CircleDollarSign, MessageCircleMore, Target, TrendingUp, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";
import { canUseManagementSurface } from "@/lib/workspace-surfaces";

const copy={
 ar:{title:"مركز قيادة النمو",sub:"حالة الإيراد والتنفيذ التي تحتاج قرارك الآن.",pipeline:"قيمة الفرص المفتوحة",won:"الإيراد المغلق",overdue:"متابعات متأخرة",open:"محادثات مفتوحة",qualified:"فرص مؤهلة",attention:"يحتاج انتباهك",attentionSub:"إشارات تشغيلية حقيقية من بيانات الشركة الحالية.",noRisk:"لا توجد إشارات تشغيلية عاجلة",goal:"مسار الهدف",goalSub:"الهدف والتوقع والفجوة ستظهر هنا بعد إغلاق Revenue Graph وGoal Intelligence.",deals:"فتح الفرص",follow:"فتح المتابعات",conversations:"فتح المحادثات"},
 tr:{title:"Büyüme komuta merkezi",sub:"Şimdi karar vermeniz gereken gelir ve yürütme durumu.",pipeline:"Açık fırsat değeri",won:"Kapanan gelir",overdue:"Geciken takipler",open:"Açık konuşmalar",qualified:"Nitelikli fırsatlar",attention:"Dikkatiniz gerekiyor",attentionSub:"Mevcut şirket verilerinden gerçek operasyon sinyalleri.",noRisk:"Acil operasyon sinyali yok",goal:"Hedef rotası",goalSub:"Revenue Graph ve Goal Intelligence tamamlandığında hedef, tahmin ve açık burada görünecek.",deals:"Fırsatları aç",follow:"Takipleri aç",conversations:"Konuşmaları aç"},
 en:{title:"Growth command center",sub:"Revenue and execution conditions that need your decision now.",pipeline:"Open opportunity value",won:"Closed revenue",overdue:"Overdue follow-ups",open:"Open conversations",qualified:"Qualified opportunities",attention:"Needs your attention",attentionSub:"Real operating signals from current company data.",noRisk:"No urgent operating signals",goal:"Goal trajectory",goalSub:"Target, forecast and gap will appear here after Revenue Graph and Goal Intelligence close.",deals:"Open opportunities",follow:"Open follow-ups",conversations:"Open conversations"}
} as const;

export default async function CommandPage(){
 const [{supabase,organizationId,membership},locale]=await Promise.all([requireWorkspace(),getLocale()]);
 if(!canUseManagementSurface(membership.role)) redirect(membership.role==="agent"?"/work":"/insights");
 const t=copy[locale]; const now=new Date().toISOString();
 const [pipeline,won,overdue,openConversations,qualified]=await Promise.all([
  supabase.from("deals").select("amount").eq("organization_id",organizationId).not("stage","in",'("won","lost")'),
  supabase.from("deals").select("amount").eq("organization_id",organizationId).eq("stage","won"),
  supabase.from("follow_ups").select("id",{count:"exact",head:true}).eq("organization_id",organizationId).in("status",["pending","in_progress"]).lt("due_at",now),
  supabase.from("conversations").select("id",{count:"exact",head:true}).eq("organization_id",organizationId).eq("status","open"),
  supabase.from("leads").select("id",{count:"exact",head:true}).eq("organization_id",organizationId).in("status",["qualified","appointment","negotiation"])
 ]);
 const sum=(rows:{amount:unknown}[]|null)=> (rows??[]).reduce((a,x)=>a+Number(x.amount??0),0);
 const metrics=[[t.pipeline,`${Intl.NumberFormat(locale).format(sum(pipeline.data))} ₺`,CircleDollarSign],[t.won,`${Intl.NumberFormat(locale).format(sum(won.data))} ₺`,TrendingUp],[t.overdue,overdue.count??0,AlertTriangle],[t.open,openConversations.count??0,MessageCircleMore],[t.qualified,qualified.count??0,UsersRound]] as const;
 const signals=[...(overdue.count?[[`${overdue.count} · ${t.overdue}`,"/follow-ups",t.follow]]:[]),...(openConversations.count?[[`${openConversations.count} · ${t.open}`,"/conversations",t.conversations]]:[])] as string[][];
 return <main className="content"><PageHeader title={t.title} subtitle={t.sub}/><section className="metrics-grid">{metrics.map(([label,value,Icon])=><article className="metric-card" key={label}><div className="metric-icon"><Icon size={21}/></div><div><p>{label}</p><strong>{value}</strong></div></article>)}</section>
 <section className="dashboard-grid"><article className="panel span-two"><div className="panel-head"><div><h2>{t.attention}</h2><p>{t.attentionSub}</p></div><AlertTriangle size={20}/></div><div className="cards-list">{signals.map(([label,href,cta])=><div className="task-row" key={href}><AlertTriangle size={18}/><div><strong>{label}</strong></div><Link className="mini-action" href={href}>{cta}</Link></div>)}{!signals.length?<div className="empty-state"><TrendingUp size={30}/><strong>{t.noRisk}</strong></div>:null}</div></article><article className="panel"><div className="panel-head"><div><h2>{t.goal}</h2><p>{t.goalSub}</p></div><Target size={20}/></div><Link className="secondary-button" href="/deals">{t.deals}</Link></article></section></main>;
}