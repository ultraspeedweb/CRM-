import { Sidebar } from "@/components/sidebar";
import { getLocale } from "@/lib/i18n";
import { requireWorkspace } from "@/lib/workspace";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [{ supabase, organizationId }, locale] = await Promise.all([requireWorkspace(), getLocale()]);
  const { data: organization } = await supabase.from("organizations").select("name").eq("id", organizationId).single();

  return <div className="workspace"><Sidebar organizationName={organization?.name ?? "SatışDesk"} locale={locale} /><div className="workspace-main">{children}</div></div>;
}
