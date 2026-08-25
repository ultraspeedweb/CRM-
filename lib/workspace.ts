import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireWorkspace = cache(async () => {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims?.sub) {
    redirect("/login");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", claims.claims.sub)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`Workspace membership lookup failed (${membershipError.code}).`);
  }

  if (!membership) {
    redirect("/onboarding");
  }

  return {
    supabase,
    userId: claims.claims.sub,
    membership,
    organizationId: membership.organization_id,
  };
});
