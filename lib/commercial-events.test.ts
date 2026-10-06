import { describe, expect, it } from "vitest";
import { createCommercialEvent, isOutcomeEvent } from "./commercial-events";

describe("commercial event envelope", () => {
  it("creates a governed event with stable identifiers", () => {
    const event = createCommercialEvent({
      eventName: "deal.won",
      organizationId: "org-1",
      actorUserId: "user-1",
      sourceType: "deal",
      sourceId: "deal-1",
      correlationId: "corr-1",
      dealId: "deal-1",
      leadId: "lead-1",
      occurredAt: "2026-10-06T06:00:00.000Z",
      metadata: { currency: "TRY", amount: 10000 },
    });
    expect(event.organizationId).toBe("org-1");
    expect(event.metadata).toEqual({ currency: "TRY", amount: 10000 });
    expect(isOutcomeEvent(event)).toBe(true);
  });

  it("rejects events without tenant or source identity", () => {
    expect(() => createCommercialEvent({
      eventName: "lead.created", organizationId: "", actorUserId: null, sourceType: "lead", sourceId: "lead-1", correlationId: null, dealId: null, leadId: "lead-1"
    })).toThrow("organizationId is required");
    expect(() => createCommercialEvent({
      eventName: "lead.created", organizationId: "org-1", actorUserId: null, sourceType: "lead", sourceId: " ", correlationId: null, dealId: null, leadId: "lead-1"
    })).toThrow("sourceId is required");
  });

  it("rejects invalid occurrence timestamps", () => {
    expect(() => createCommercialEvent({
      eventName: "followup.completed", organizationId: "org-1", actorUserId: "user-1", sourceType: "followup", sourceId: "f-1", correlationId: null, dealId: null, leadId: "lead-1", occurredAt: "not-a-date"
    })).toThrow("occurredAt must be an ISO-compatible timestamp");
  });
});