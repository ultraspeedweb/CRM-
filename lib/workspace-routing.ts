import type { SupabaseClient } from "@supabase/supabase-js";
import { workspaceHomeForRole } from "@/lib/workspace-surfaces";

export const LEGACY_WORKSPACE_ENTRY = "/dashboard" as const;
export const ONBOARDING_ENTRY = "/onboarding" as const;

/**
 * Resolve the canonical post-auth destination from active membership data.
 * This is the single routing contract for login/onboarding/auth flows.
 * Unknown roles fail safe through workspaceHomeForRole -> /insights.
 */
export async function resolveAuthenticatedDestination(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const { data: membership, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!membership) return ONBOARDING_ENTRY;
  return workspaceHomeForRole(String(membership.role));
}
