import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { canEnqueueSovereignMessage, validateSovereignEvent, verifySovereignSignature } from "./sovereign-messaging";

const event = {
  version: 1, event_id: "12345678-1234-4123-8123-123456789012",
  event_type: "booking.confirmed", occurred_at: "2026-10-17T10:00:00Z",
  source: "sovereign", source_tenant_id: "12345678-1234-4123-8123-123456789013",
  booking_id: "12345678-1234-4123-8123-123456789014", customer_reference: "guest-1",
  recipient_e164: "+905551234567", locale: "tr", template_key: "booking_confirmation",
  parameters: { booking_reference: "BK-123" },
} as const;
const secret = "12345678901234567890123456789012";

describe("Sovereign -> SatışDesk policy", () => {
  it("accepts minimal signed-envelope payload for confirmed booking", () => {
    expect(validateSovereignEvent(event)).toEqual(event);
  });
  it("rejects unknown templates, marketing messages and recipient injection", () => {
    expect(validateSovereignEvent({ ...event, event_type: "lead.created" })).toBeNull();
    expect(validateSovereignEvent({ ...event, template_key: "marketing_blast" })).toBeNull();
    expect(validateSovereignEvent({ ...event, recipient_e164: "555123" })).toBeNull();
    expect(validateSovereignEvent({ ...event, parameters: { x: "a".repeat(201) } })).toBeNull();
  });
  it("authenticates raw body and rejects tampering", () => {
    const body = JSON.stringify(event);
    const signature = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
    expect(verifySovereignSignature(body, signature, secret)).toBe(true);
    expect(verifySovereignSignature(body + " ", signature, secret)).toBe(false);
    expect(verifySovereignSignature(body, "sha256=invalid", secret)).toBe(false);
  });
  it("never authorizes pre-booking contact, without consent or disabled service", () => {
    const verified = validateSovereignEvent(event)!;
    expect(canEnqueueSovereignMessage(verified, false, true, true)).toBe(false);
    expect(canEnqueueSovereignMessage(verified, true, false, true)).toBe(false);
    expect(canEnqueueSovereignMessage(verified, true, true, false)).toBe(false);
    expect(canEnqueueSovereignMessage(verified, true, true, true)).toBe(true);
  });
});
