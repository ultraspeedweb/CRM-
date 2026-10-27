import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";
import { workspaceHomeForRole } from "@/lib/workspace-surfaces";

/**
 * Compatibility entry point only.
 * SatışDesk no longer has one universal CRM dashboard. The active
 * organization membership determines the user's operating surface.
 */
export default async function DashboardPage() {
  const { membership } = await requireWorkspace();
  redirect(workspaceHomeForRole(membership.role));
}
