import { Sidebar } from "@/components/sidebar";
import { requireWorkspace } from "@/lib/workspace";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { supabase, organizationId } = await requireWorkspace();
  const { data: organization } = await supabase.from("organizations").select("name").eq("id", organizationId).single();

  return <div className="workspace"><Sidebar organizationName={organization?.name ?? "SatışDesk"} /><div className="workspace-main">{children}</div></div>;
}
