export const manageablePlatformServices = ["web_inbox", "whatsapp", "ai_sales_agent", "automations", "notifications", "shopify", "woocommerce"] as const;
export const platformServiceStatuses = ["enabled", "disabled", "suspended"] as const;
export type PlatformServiceStatusInput = { organizationId: string; serviceKey: typeof manageablePlatformServices[number]; status: typeof platformServiceStatuses[number]; reason: string | null };
export function parsePlatformServiceStatusInput(formData: FormData): PlatformServiceStatusInput {
  const organizationId = String(formData.get("organization_id") ?? "");
  const serviceKey = String(formData.get("service_key") ?? "");
  const status = String(formData.get("status") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(organizationId)
    || !manageablePlatformServices.some(key => key === serviceKey)
    || !platformServiceStatuses.some(value => value === status)
    || reason.length > 500
    || (status !== "enabled" && reason.length < 5)) {
    throw new Error("Invalid service control request");
  }
  return { organizationId, serviceKey: serviceKey as PlatformServiceStatusInput["serviceKey"], status: status as PlatformServiceStatusInput["status"], reason: reason || null };
}
