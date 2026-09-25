import Link from "next/link";
import { Bell, ShieldAlert, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getLocale, type Locale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";

type Copy={title:string;sub:string;empty:string;emptySub:string;assigned:string;escalated:string;open:string};
const copy:Record<Locale,Copy>={
 ar:{title:"الإشعارات",sub:"تنبيهات التعيين والتصعيد الخاصة بك داخل المؤسسة الحالية.",empty:"لا توجد إشعارات",emptySub:"ستظهر هنا التعيينات والتصعيدات الجديدة.",assigned:"متابعة معيّنة",escalated:"متابعة مصعّدة",open:"فتح المتابعة"},
 tr:{title:"Bildirimler",sub:"Mevcut kuruluşunuzdaki atama ve yükseltme bildirimleriniz.",empty:"Bildirim yok",emptySub:"Yeni atamalar ve yükseltmeler burada görünür.",assigned:"Takip atandı",escalated:"Takip yükseltildi",open:"Takibi aç"},
 en:{title:"Notifications",sub:"Your assignment and escalation alerts in the current organization.",empty:"No notifications",emptySub:"New assignments and escalations will appear here.",assigned:"Follow-up assigned",escalated:"Follow-up escalated",open:"Open follow-up"}
};
export default async function NotificationsPage(){
 const [locale,{supabase,organizationId,userId}]=await Promise.all([getLocale(),requireWorkspace()]);const t=copy[locale];
 const {data}=await supabase.from("notifications").select("id,notification_type,title,body,entity_type,entity_id,is_read,created_at").eq("organization_id",organizationId).eq("user_id",userId).order("created_at",{ascending:false}).limit(50);
 const items=data??[];
 return <main className="content"><PageHeader title={t.title} subtitle={t.sub}/><section className="panel"><div className="cards-list">{items.map(item=>{const escalated=item.notification_type==="follow_up_escalated";const Icon=escalated?ShieldAlert:UserRoundCheck;return <div className="task-row" key={item.id}><Icon size={18}/><div><strong>{item.title|| (escalated?t.escalated:t.assigned)}</strong><small>{item.body}</small></div><time>{new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Istanbul"}).format(new Date(item.created_at))}</time>{item.entity_type==="follow_up"&&item.entity_id&&<Link className="mini-action" href="/follow-ups">{t.open}</Link>}</div>})}{!items.length&&<div className="empty-state"><Bell size={30}/><strong>{t.empty}</strong><span>{t.emptySub}</span></div>}</div></section></main>;
}
