import "server-only";
import { createClient } from "@supabase/supabase-js";

export type PlatformServiceKey = "core" | "web_inbox" | "whatsapp" | "ai_sales_agent" | "automations" | "notifications" | "shopify" | "woocommerce";

function createControlPlaneClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("Supabase server credentials are not configured.");
  // The private control-plane schema is intentionally excluded from tenant Database types.
  return createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Uncertified external integrations require a deployment release flag AND an operator enablement. */
export async function isPlatformServiceEnabled(organizationId: string, serviceKey: PlatformServiceKey): Promise<boolean> {
  const releaseFlags: Partial<Record<PlatformServiceKey, string>> = {
    whatsapp: "SATISDESK_WHATSAPP_ENABLED",
    ai_sales_agent: "SATISDESK_AI_ENABLED",
    shopify: "SATISDESK_SHOPIFY_ENABLED",
    woocommerce: "SATISDESK_WOOCOMMERCE_ENABLED",
  };
  const flag = releaseFlags[serviceKey];
  if (flag && process.env[flag] !== "true") return false;
  try {
    const admin = createControlPlaneClient();
    const { data, error } = await admin.rpc("is_platform_service_enabled", {
      p_organization_id: organizationId,
      p_service_key: serviceKey,
    });
    return !error && data === true;
  } catch {
    return false;
  }
}
