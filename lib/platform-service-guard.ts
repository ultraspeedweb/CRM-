import "server-only";
import { createClient } from "@supabase/supabase-js";

export type PlatformServiceKey = "core" | "web_inbox" | "whatsapp" | "ai_sales_agent" | "automations" | "notifications" | "shopify" | "woocommerce";
type ControlRow = { service_key: string; status: string };

function createControlPlaneClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("Supabase server credentials are not configured.");
  // The private control-plane schema is intentionally excluded from tenant Database types.
  return createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Fail closed when a configured control cannot be read. Missing rows mean enabled. Core disables every tenant service. */
export async function isPlatformServiceEnabled(organizationId: string, serviceKey: PlatformServiceKey): Promise<boolean> {
  try {
    const admin = createControlPlaneClient();
    const { data, error } = await admin
      .schema("private")
      .from("platform_service_controls")
      .select("service_key,status")
      .eq("organization_id", organizationId)
      .in("service_key", ["core", serviceKey]);
    if (error) return false;
    const controls: ControlRow[] = Array.isArray(data)
      ? data.filter((row): row is ControlRow => Boolean(row) && typeof row.service_key === "string" && typeof row.status === "string")
      : [];
    const core = controls.find((row) => row.service_key === "core");
    if (core && core.status !== "enabled") return false;
    const service = controls.find((row) => row.service_key === serviceKey);
    return !service || service.status === "enabled";
  } catch {
    return false;
  }
}
