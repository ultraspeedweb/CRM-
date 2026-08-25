import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { extractWhatsAppEvents, verifyMetaSignature } from "./whatsapp";

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
});
