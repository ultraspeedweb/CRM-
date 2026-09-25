import Link from "next/link";
import { BarChart3, Bell, Bot, CalendarDays, Contact, HandCoins, LayoutDashboard, LogOut, MessageCircleMore, Settings2, UserRoundCheck } from "lucide-react";
import { signOut } from "@/app/(workspace)/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n";

const labels = {
  ar: { dashboard: "نظرة عامة", leads: "العملاء", conversations: "المحادثات", followups: "المتابعات", notifications:"الإشعارات", appointments: "المواعيد", deals: "الصفقات", automation: "الأتمتة", reports: "التقارير", settings: "الإعدادات", signout: "تسجيل الخروج", secure: "مساحة آمنة", center: "مركز قيادة المبيعات" },
  tr: { dashboard: "Genel bakış", leads: "Müşteriler", conversations: "Konuşmalar", followups: "Takipler", notifications:"Bildirimler", appointments: "Randevular", deals: "Fırsatlar", automation: "Otomasyon", reports: "Raporlar", settings: "Ayarlar", signout: "Çıkış yap", secure: "Güvenli alan", center: "Satış komuta merkezi" },
  en: { dashboard: "Overview", leads: "Leads", conversations: "Conversations", followups: "Follow-ups", notifications:"Notifications", appointments: "Appointments", deals: "Deals", automation: "Automation", reports: "Reports", settings: "Settings", signout: "Sign out", secure: "Secure workspace", center: "Sales command center" },
} as const;

export function Sidebar({ organizationName, locale }: { organizationName: string; locale: Locale }) {
  const t = labels[locale];
  const links = [
    ["/dashboard", t.dashboard, LayoutDashboard], ["/leads", t.leads, Contact], ["/conversations", t.conversations, MessageCircleMore],
    ["/follow-ups", t.followups, UserRoundCheck], ["/notifications",t.notifications,Bell], ["/appointments", t.appointments, CalendarDays], ["/deals", t.deals, HandCoins], ["/automation", t.automation, Bot],
  ] as const;
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="side-brand"><span className="brand-mark">S</span><span><strong>SatışDesk</strong><small>{t.center}</small></span></Link>
      <LanguageSwitcher locale={locale} next="/dashboard" />
      <nav>{links.map(([href, label, Icon]) => <Link key={href} href={href}><Icon size={19} /><span>{label}</span></Link>)}</nav>
      <div className="sidebar-bottom">
        <Link href="/reports"><BarChart3 size={19} /> {t.reports}</Link>
        <Link href="/settings"><Settings2 size={19} /> {t.settings}</Link>
        <form action={signOut}><button type="submit"><LogOut size={19} /> {t.signout}</button></form>
        <div className="org-chip"><div className="avatar">{organizationName.slice(0, 1)}</div><span><strong>{organizationName}</strong><small>{t.secure}</small></span><Link href="/notifications" aria-label={t.notifications}><Bell size={16} /></Link></div>
      </div>
    </aside>
  );
}
