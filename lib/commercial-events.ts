export const COMMERCIAL_EVENT_NAMES = [
  "lead.created",
  "lead.qualified",
  "followup.created",
  "followup.completed",
  "quote.sent",
  "quote.accepted",
  "deal.stage_changed",
  "deal.won",
  "deal.lost",
  "outcome.recorded",
] as const;

export type CommercialEventName = (typeof COMMERCIAL_EVENT_NAMES)[number];

export type CommercialEventEnvelope = {
  eventName: CommercialEventName;
  organizationId: string;
  occurredAt: string;
  actorUserId: string | null;
  sourceType: "lead" | "followup" | "quote" | "deal" | "outcome";
  sourceId: string;
  correlationId: string | null;
  dealId: string | null;
  leadId: string | null;
  metadata: Record<string, string | number | boolean | null>;
};

export type CommercialEventInput = Omit<CommercialEventEnvelope, "occurredAt" | "metadata"> & {
  occurredAt?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function createCommercialEvent(input: CommercialEventInput): CommercialEventEnvelope {
  if (!input.organizationId.trim()) throw new Error("organizationId is required");
  if (!input.sourceId.trim()) throw new Error("sourceId is required");

  const occurredAt = input.occurredAt ?? new Date().toISOString();
  if (Number.isNaN(Date.parse(occurredAt))) throw new Error("occurredAt must be an ISO-compatible timestamp");

  return {
    ...input,
    occurredAt,
    metadata: { ...(input.metadata ?? {}) },
  };
}

export function isOutcomeEvent(event: CommercialEventEnvelope): boolean {
  return event.eventName === "deal.won" || event.eventName === "deal.lost" || event.eventName === "outcome.recorded";
}