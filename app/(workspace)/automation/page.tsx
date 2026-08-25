import { Bot, PlayCircle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { requireWorkspace } from "@/lib/workspace";

export default async function AutomationPage() {
  const { supabase, organizationId } = await requireWorkspace();
  const { data } = await supabase.from("automation_rules").select("id,name,trigger_type,is_active,last_run_at,actions").eq("organization_id", organizationId).order("created_at");
  return <main className="content"><PageHeader title="الأتمتة" subtitle="قواعد قابلة للتتبع مع منع التكرار وسجل تشغيل واضح." /><section className="automation-intro"><div><Bot size={26} /><span><strong>Automation Core</strong><small>جاهز لاستقبال قواعد التشغيل</small></span></div><div><ShieldCheck size={18} /> كل تشغيل معزول حسب المؤسسة</div></section><section className="panel"><div className="panel-head"><div><h2>قواعد التشغيل</h2><p>{data?.length ?? 0} قاعدة</p></div><PlayCircle size={20} /></div><div className="cards-list">{(data ?? []).map((rule) => <div className="rule-row" key={rule.id}><span className={`toggle ${rule.is_active ? "on" : ""}`} /><div><strong>{rule.name}</strong><small>{rule.trigger_type}</small></div><span>{Array.isArray(rule.actions) ? rule.actions.length : 0} إجراء</span></div>)}{!data?.length && <div className="empty-state"><Bot size={30} /><strong>الكور جاهز</strong><span>أضف أول قاعدة عند ربط قناة الرسائل.</span></div>}</div></section></main>;
}
