import { CircleDollarSign, Eye, TrendingUp, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";

const copy={
 ar:{title:"الرؤى",sub:"عرض آمن للبيانات التجارية المصرح لك بمشاهدتها.",customers:"العملاء",qualified:"المؤهلون",pipeline:"قيمة المسار",note:"عرض للقراءة فقط",noteSub:"هذه الصفحة لا تمنح صلاحيات تنفيذ أو إدارة. الوصول الفعلي تحكمه صلاحيات الخادم وRLS."},
 tr:{title:"İçgörüler",sub:"Görme yetkiniz olan ticari verilerin güvenli görünümü.",customers:"Müşteriler",qualified:"Nitelikli",pipeline:"Pipeline değeri",note:"Salt okunur görünüm",noteSub:"Bu sayfa yürütme veya yönetim yetkisi vermez. Gerçek erişim sunucu yetkileri ve RLS tarafından belirlenir."},
 en:{title:"Insights",sub:"A safe view of commercial data you are authorized to see.",customers:"Customers",qualified:"Qualified",pipeline:"Pipeline value",note:"Read-only surface",noteSub:"This page grants no execution or management authority. Actual access remains enforced by server authorization and RLS."}
} as const;

export default async function InsightsPage(){
 const [{supabase,organizationId},locale]=await Promise.all([requireWorkspace(),getLocale()]); const t=copy[locale];
 const [customers,qualified,pipeline]=await Promise.all([
  supabase.from("leads").select("id",{count:"exact",head:true}).eq("organization_id",organizationId),
  supabase.from("leads").select("id",{count:"exact",head:true}).eq("organization_id",organizationId).in("status",["qualified","appointment","negotiation"]),
  supabase.from("deals").select("amount").eq("organization_id",organizationId).neq("stage","lost")
 ]);
 const pipelineTotal=(pipeline.data??[]).reduce((sum,item)=>sum+Number(item.amount??0),0);
 const metrics=[[t.customers,customers.count??0,UsersRound],[t.qualified,qualified.count??0,TrendingUp],[t.pipeline,`${Intl.NumberFormat(locale).format(pipelineTotal)} ₺`,CircleDollarSign]] as const;
 return <main className="content"><PageHeader title={t.title} subtitle={t.sub}/><section className="metrics-grid">{metrics.map(([label,value,Icon])=><article className="metric-card" key={label}><div className="metric-icon"><Icon size={21}/></div><div><p>{label}</p><strong>{value}</strong></div></article>)}</section><section className="panel"><div className="panel-head"><div><h2>{t.note}</h2><p>{t.noteSub}</p></div><Eye size={20}/></div></section></main>;
}