"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

import { parsePlatformServiceStatusInput } from "./service-validation";

export async function setPlatformServiceStatus(formData: FormData) {
  const { organizationId, serviceKey, status, reason } = parsePlatformServiceStatusInput(formData);

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // The SQL security-definer RPC performs the authoritative platform role
  // check and writes an audit entry in the same transaction.
  const rpc = supabase as unknown as { rpc: (name: "set_platform_service_status", args: { p_organization_id: string; p_service_key: string; p_status: string; p_reason: string | null }) => Promise<{ error: unknown }> };
  const { error } = await rpc.rpc("set_platform_service_status", {
    p_organization_id: organizationId,
    p_service_key: serviceKey,
    p_status: status,
    p_reason: reason || null,
  });
  if (error) throw new Error("Service update denied or failed");
  revalidatePath("/platform");
}
