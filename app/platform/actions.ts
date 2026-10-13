"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const serviceKeys = ["web_inbox", "whatsapp", "ai_sales_agent", "automations", "notifications", "shopify", "woocommerce"] as const;
const statuses = ["enabled", "disabled", "suspended"] as const;

export async function setPlatformServiceStatus(formData: FormData) {
  const organizationId = String(formData.get("organization_id") ?? "");
  const serviceKey = String(formData.get("service_key") ?? "");
  const status = String(formData.get("status") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(organizationId) ||
      !serviceKeys.some((key) => key === serviceKey) ||
      !statuses.some((value) => value === status) ||
      reason.length > 500 ||
      (status !== "enabled" && reason.length < 5)) {
    throw new Error("Invalid service control request");
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // The SQL security-definer RPC performs the authoritative platform role
  // check and writes an audit entry in the same transaction.
  const { error } = await supabase.rpc("set_platform_service_status", {
    p_organization_id: organizationId,
    p_service_key: serviceKey,
    p_status: status,
    p_reason: reason || null,
  });
  if (error) throw new Error("Service update denied or failed");
  revalidatePath("/platform");
}
