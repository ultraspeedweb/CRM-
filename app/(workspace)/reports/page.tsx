import { BarChart3, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
export default function ReportsPage(){return <main className="content"><PageHeader title="التقارير" subtitle="مؤشرات المصدر، التحويل، سرعة الرد وقيمة المسار."/><section className="panel placeholder-panel"><BarChart3 size={42}/><h2>التقارير جاهزة للبيانات الحقيقية</h2><p>ستتفعّل الرسوم تلقائيًا مع دخول العملاء والصفقات.</p><span><ShieldCheck size={16}/> لا توجد بيانات تجريبية مضللة</span></section></main>}
