import { createHmac, timingSafeEqual } from "node:crypto";

export const SOVEREIGN_EVENT_TYPES = [
  "booking.confirmed", "booking.updated", "booking.cancelled",
  "payment.completed", "trip.reminder", "customer.support_requested",
] as const;

export type SovereignEventType = (typeof SOVEREIGN_EVENT_TYPES)[number];
export type SovereignEvent = {
  version: 1;
  event_id: string;
  event_type: SovereignEventType;
  occurred_at: string;
  source: "sovereign";
  source_tenant_id: string;
  booking_id: string;
  customer_reference: string;
  recipient_e164: string;
  locale: "ar" | "tr" | "en";
  template_key: string;
  parameters: Record<string, string>;
};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const e164 = /^\+[1-9]\d{7,14}$/;
const allowedTemplates: Record<SovereignEventType, string> = {
  "booking.confirmed": "booking_confirmation",
  "booking.updated": "booking_update",
  "booking.cancelled": "booking_cancellation",
  "payment.completed": "payment_receipt",
  "trip.reminder": "trip_reminder",
  "customer.support_requested": "support_request",
};

/** Admission policy only. No event can authorize a send without persisted booking and consent checks. */
export function validateSovereignEvent(input: unknown): SovereignEvent | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const v = input as Record<string, unknown>;
  if (v.version !== 1 || v.source !== "sovereign") return null;
  if (typeof v.event_type !== "string" || !SOVEREIGN_EVENT_TYPES.some(t => t === v.event_type)) return null;
  const type = v.event_type as SovereignEventType;
  if (typeof v.template_key !== "string" || v.template_key !== allowedTemplates[type]) return null;
  if (![v.event_id, v.source_tenant_id, v.booking_id].every(x => typeof x === "string" && uuid.test(x))) return null;
  if (typeof v.customer_reference !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(v.customer_reference)) return null;
  if (typeof v.recipient_e164 !== "string" || !e164.test(v.recipient_e164)) return null;
  if (!["ar", "tr", "en"].includes(String(v.locale))) return null;
  if (typeof v.occurred_at !== "string" || !/^\d{4}-\d\d-\d\dT/.test(v.occurred_at) || !Number.isFinite(Date.parse(v.occurred_at))) return null;
  if (!v.parameters || typeof v.parameters !== "object" || Array.isArray(v.parameters)) return null;
  const parameters = v.parameters as Record<string, unknown>;
  if (Object.keys(parameters).length > 10 || Object.entries(parameters).some(([k, val]) => !/^[a-z_]{1,40}$/.test(k) || typeof val !== "string" || val.length > 200)) return null;
  return input as SovereignEvent;
}

export function verifySovereignSignature(body: string, header: string | null, secret: string): boolean {
  if (secret.length < 32 || !header || !/^sha256=[a-f0-9]{64}$/i.test(header)) return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  const supplied = Buffer.from(header.slice(7), "hex");
  return supplied.length === expected.length && timingSafeEqual(expected, supplied);
}

/** Only confirmed post-booking messages may move to the outbox. */
export function canEnqueueSovereignMessage(event: SovereignEvent, bookingConfirmed: boolean, consentGranted: boolean, serviceEnabled: boolean): boolean {
  return bookingConfirmed && consentGranted && serviceEnabled && SOVEREIGN_EVENT_TYPES.includes(event.event_type);
}
