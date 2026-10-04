import Link from "next/link";
import { BarChart3, Bell, Bot, CalendarDays, Contact, HandCoins, LayoutDashboard, ListChecks, LogOut, MessageCircleMore, Settings2, Target, UserRoundCheck } from "lucide-react";
import { signOut } from "@/app/(workspace)/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n";
import { canUseExecutionSurface, canUseManagementSurface, workspaceHomeForRole } from "@/lib/workspace-surfaces";

const labels = {
  ar: { command: "مركز النمو", work: "عملي اليوم", insights: "الرؤى", leads: "العملاء", conversations: "المحادثات", followups: "المتابعات", notifications:"الإشعارات", appointments: "المواعيد", deals: "الفرص", automation: "الأتمتة", reports: "التقارير", settings: "الإعدادات", signout: "تسجيل الخروج", secure: "مساحة آمنة", center: "نظام تشغيل الإيرادات والنمو" },
  tr: { command: "Büyüme merkezi", work: "Bugünkü işlerim", insights: "İçgörüler", leads: "Müşteriler", conversations: "Konuşmalar", followups: "Takipler", notifications:"Bildirimler", appointments: "Randevular", deals: "Fırsatlar", automation: "Otomasyon", reports: "Raporlar", settings: "Ayarlar", signout: "Çıkış yap", secure: "Güvenli alan", center: "Gelir ve büyüme işletim sistemi" },
  en: { command: "Growth command", work: "My work", insights: "Insights", leads: "Customers", conversations: "Conversations", followups: "Follow-ups", notifications:"Notifications", appointments: "Appointments", deals: "Opportunities", automation: "Automation", reports: "Reports", settings: "Settings", signout: "Sign out", secure: "Secure workspace", center: "Revenue & growth operating system" },
} as const;

export function Sidebar({ organizationName, locale, role }: { organizationName: string; locale: Locale; role: string }) {
  const t = labels[locale];
  const home = workspaceHomeForRole(role);
  const homeLabel = home === "/command" ? t.command : home === "/work" ? t.work : t.insights;
  const HomeIcon = home === "/command" ? Target : home === "/work" ? ListChecks : LayoutDashboard;

  const links = [
    [home, homeLabel, HomeIcon],
    ...(canUseExecutionSurface(role) ? [["/conversations", t.conversations, MessageCircleMore], ["/follow-ups", t.followups, UserRoundCheck], ["/appointments", t.appointments, CalendarDays], ["/deals", t.deals, HandCoins]] as const : []),
    ...(canUseManagementSurface(role) ? [["/leads", t.leads, Contact], ["/automation", t.automation, Bot]] as const : []),
  ] as const;

  return (
    <aside className="sidebar">
      <Link href={home} className="side-brand"><span className="brand-mark">S</span><span><strong>SatışDesk</strong><small>{t.center}</small></span></Link>
      <LanguageSwitcher locale={locale} next={home} />
      <nav>{links.map(([href, label, Icon]) => <Link key={href} href={href}><Icon size={19} /><span>{label}</span></Link>)}</nav>
      <div className="sidebar-bottom">
        {canUseManagementSurface(role) ? <Link href="/reports"><BarChart3 size={19} /> {t.reports}</Link> : null}
        {canUseManagementSurface(role) ? <Link href="/settings"><Settings2 size={19} /> {t.settings}</Link> : null}
        <form action={signOut}><button type="submit"><LogOut size={19} /> {t.signout}</button></form>
        <div className="org-chip"><div className="avatar">{organizationName.slice(0, 1)}</div><span><strong>{organizationName}</strong><small>{t.secure}</small></span><Link href="/notifications" aria-label={t.notifications}><Bell size={16} /></Link></div>
      </div>
    </aside>
  );
}
