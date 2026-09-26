import { createAdminClient } from "@/lib/supabase/admin";

export type PlatformServiceKey = "core" | "web_inbox" | "whatsapp" | "ai_sales_agent" | "automations" | "notifications" | "shopify" | "woocommerce";
type ControlRow = { service_key: string; status: string };

/** Fail closed when a configured control cannot be read. Missing rows mean enabled. Core disables every tenant service. */
export async function isPlatformServiceEnabled(organizationId: string, serviceKey: PlatformServiceKey): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .schema("private")
    .from("platform_service_controls")
    .select("service_key,status")
    .eq("organization_id", organizationId)
    .in("service_key", ["core", serviceKey]);
  if (error) return false;
  const controls = (data ?? []) as ControlRow[];
  const core = controls.find((row) => row.service_key === "core");
  if (core && core.status !== "enabled") return false;
  const service = controls.find((row) => row.service_key === serviceKey);
  return !service || service.status === "enabled";
}
