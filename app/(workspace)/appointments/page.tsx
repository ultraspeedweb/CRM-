import { CalendarDays, Clock3, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";
import { createAppointment } from "../actions";

type Props = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function AppointmentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase, organizationId } = await requireWorkspace();
  const [appointments, leads] = await Promise.all([
    supabase.from("appointments").select("id,title,starts_at,ends_at,status,location,leads(full_name)").eq("organization_id", organizationId).order("starts_at"),
    supabase.from("leads").select("id,full_name").eq("organization_id", organizationId).order("full_name"),
  ]);

  return <main className="content"><PageHeader title="المواعيد" subtitle="جدول المعاينات والاجتماعات والمتابعات المؤكدة." />
    {params.error && <div className="alert error">{params.error}</div>}{params.success && <div className="alert success">{params.success}</div>}
    <section className="split-view"><article className="panel form-panel"><div className="panel-head"><div><h2>موعد جديد</h2><p>التوقيت: إسطنبول</p></div><Plus size={20} /></div><form className="stack-form" action={createAppointment}>
      <label>العميل<select name="leadId" required defaultValue=""><option value="" disabled>اختر العميل</option>{(leads.data ?? []).map((lead) => <option key={lead.id} value={lead.id}>{lead.full_name}</option>)}</select></label>
      <label>عنوان الموعد<input name="title" required placeholder="معاينة عقار" /></label>
      <label>وقت البداية<input name="startsAt" type="datetime-local" required /></label>
      <label>المدة<select name="durationMinutes" defaultValue="60"><option value="30">30 دقيقة</option><option value="60">ساعة</option><option value="90">90 دقيقة</option><option value="120">ساعتان</option></select></label>
      <label>المكان<input name="location" placeholder="المكتب أو عنوان العقار" /></label>
      <button className="primary-button" type="submit" disabled={!leads.data?.length}>حفظ الموعد</button>
    </form></article>
    <article className="panel grow"><div className="panel-head"><div><h2>الجدول</h2><p>Europe / Istanbul</p></div><CalendarDays size={20} /></div><div className="appointment-list">{(appointments.data ?? []).map((item) => { const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads; const date = new Date(item.starts_at); return <div className="appointment-row" key={item.id}><div className="date-tile"><b>{new Intl.DateTimeFormat("ar", { day: "numeric", timeZone: "Europe/Istanbul" }).format(date)}</b><span>{new Intl.DateTimeFormat("ar", { month: "short", timeZone: "Europe/Istanbul" }).format(date)}</span></div><div><strong>{item.title}</strong><span>{lead?.full_name ?? "عميل"} · {item.location ?? "عن بُعد"}</span></div><time><Clock3 size={15} /> {new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(date)}</time></div>})}{!appointments.data?.length && <div className="empty-state"><CalendarDays size={30} /><strong>لا توجد مواعيد</strong><span>اختر عميلًا وأضف أول موعد.</span></div>}</div></article></section>
  </main>;
}
