import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { rpc, client } = vi.hoisted(() => ({ rpc: vi.fn(), client: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@supabase/supabase-js", () => ({ createClient: client }));
import { isPlatformServiceEnabled } from "./platform-service-guard";

describe("platform service admission", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "test-only");
    for (const key of ["WHATSAPP", "AI", "SHOPIFY", "WOOCOMMERCE"]) vi.stubEnv(`SATISDESK_${key}_ENABLED`, "false");
    client.mockReturnValue({ rpc });
    rpc.mockResolvedValue({ data: true, error: null });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
  it.each(["whatsapp", "ai_sales_agent", "shopify", "woocommerce"] as const)("blocks uncertified %s before reading credentials", async service => {
    expect(await isPlatformServiceEnabled("org", service)).toBe(false);
    expect(client).not.toHaveBeenCalled();
  });
  it("admits operational web inbox through the scoped server RPC", async () => {
    expect(await isPlatformServiceEnabled("org", "web_inbox")).toBe(true);
    expect(rpc).toHaveBeenCalledWith("is_platform_service_enabled", { p_organization_id: "org", p_service_key: "web_inbox" });
  });
  it("requires operator enablement even with the WhatsApp release flag", async () => {
    vi.stubEnv("SATISDESK_WHATSAPP_ENABLED", "true");
    rpc.mockResolvedValue({ data: false, error: null });
    expect(await isPlatformServiceEnabled("org", "whatsapp")).toBe(false);
  });
  it.each([{ data: true, error: { code: "42501" } }, { data: null, error: null }])("fails closed on failed or malformed control reads", async result => {
    rpc.mockResolvedValue(result);
    expect(await isPlatformServiceEnabled("org", "web_inbox")).toBe(false);
  });
  it("fails closed on unavailable server credentials and network failures", async () => {
    rpc.mockRejectedValue(new Error("unavailable"));
    expect(await isPlatformServiceEnabled("org", "web_inbox")).toBe(false);
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    expect(await isPlatformServiceEnabled("org", "web_inbox")).toBe(false);
  });
});
