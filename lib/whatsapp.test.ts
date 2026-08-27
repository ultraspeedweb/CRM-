import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  buildWhatsAppThreadId,
  extractWhatsAppEvents,
  getPhoneNumberIdFromThreadId,
  resolveWhatsAppAccessToken,
  verifyMetaSignature,
} from "./whatsapp";

describe("Meta webhook security", () => {
  it("accepts only a matching HMAC signature", () => {
    const body = '{"object":"whatsapp_business_account"}';
    const signature = `sha256=${createHmac("sha256", "secret").update(body).digest("hex")}`;
    expect(verifyMetaSignature(body, signature, "secret")).toBe(true);
    expect(verifyMetaSignature(body, signature, "wrong")).toBe(false);
  });

  it("ignores unrelated webhook objects", () => {
    expect(extractWhatsAppEvents({ object: "page", entry: [] })).toEqual([]);
  });

  it("routes conversations by the receiving WhatsApp number", () => {
    const threadId = buildWhatsAppThreadId("123456", "905551112233");
    expect(threadId).toBe("123456:905551112233");
    expect(getPhoneNumberIdFromThreadId(threadId)).toBe("123456");
    expect(getPhoneNumberIdFromThreadId("905551112233")).toBeNull();
  });

  it("only resolves dedicated WhatsApp access-token environment keys", () => {
    process.env.WHATSAPP_ACCESS_TOKEN_TENANT_A = "token-a";

    expect(resolveWhatsAppAccessToken("WHATSAPP_ACCESS_TOKEN_TENANT_A")).toBe("token-a");
    expect(resolveWhatsAppAccessToken("SUPABASE_SECRET_KEY")).toBeNull();
    expect(resolveWhatsAppAccessToken("NEXT_PUBLIC_WHATSAPP_ACCESS_TOKEN")).toBeNull();

    delete process.env.WHATSAPP_ACCESS_TOKEN_TENANT_A;
  });
});
