import Link from "next/link";
import { BarChart3, Bell, Bot, CalendarDays, Contact, HandCoins, LayoutDashboard, LogOut, MessageCircleMore, Settings2, UserRoundCheck } from "lucide-react";
import { signOut } from "@/app/(workspace)/actions";

const links = [
  ["/dashboard", "نظرة عامة", LayoutDashboard],
  ["/leads", "العملاء", Contact],
  ["/conversations", "المحادثات", MessageCircleMore],
  ["/follow-ups", "المتابعات", UserRoundCheck],
  ["/appointments", "المواعيد", CalendarDays],
  ["/deals", "الصفقات", HandCoins],
  ["/automation", "الأتمتة", Bot],
] as const;

export function Sidebar({ organizationName }: { organizationName: string }) {
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="side-brand"><span className="brand-mark">S</span><span><strong>SatışDesk</strong><small>Sales command center</small></span></Link>
      <nav>{links.map(([href, label, Icon]) => <Link key={href} href={href}><Icon size={19} /><span>{label}</span></Link>)}</nav>
      <div className="sidebar-bottom">
        <Link href="/reports"><BarChart3 size={19} /> التقارير</Link>
        <Link href="/settings"><Settings2 size={19} /> الإعدادات</Link>
        <form action={signOut}><button type="submit"><LogOut size={19} /> تسجيل الخروج</button></form>
        <div className="org-chip"><div className="avatar">{organizationName.slice(0, 1)}</div><span><strong>{organizationName}</strong><small>مساحة آمنة</small></span><Bell size={16} /></div>
      </div>
    </aside>
  );
}
