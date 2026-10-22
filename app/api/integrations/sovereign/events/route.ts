import { createAdminClient } from "@/lib/supabase/admin";
import { validateSovereignEvent, verifySovereignSignature } from "@/lib/sovereign-messaging";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.SOVEREIGN_EVENT_SIGNING_SECRET;
  const boundSource = process.env.SOVEREIGN_SOURCE_TENANT_ID;
  const boundOrg = process.env.SOVEREIGN_SATISDESK_ORGANIZATION_ID;
  if (!secret || !boundSource || !boundOrg) return new Response("Connector not configured", { status: 503 });
  const size = Number(request.headers.get("content-length") ?? 0);
  if (size > 8192) return new Response("Payload too large", { status: 413 });
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > 8192) return new Response("Payload too large", { status: 413 });
  if (!verifySovereignSignature(raw, request.headers.get("x-sovereign-signature-256"), secret)) return new Response("Invalid signature", { status: 401 });
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return new Response("Invalid JSON", { status: 400 }); }
  const event = validateSovereignEvent(json);
  if (!event || event.source_tenant_id !== boundSource) return new Response("Invalid event", { status: 422 });
  // An event is never sufficient proof that a booking is confirmed or that consent exists.
  // The ledger has no send capability; a future outbox must verify both independently.
  const eventTime = Date.parse(event.occurred_at);
  if (Math.abs(Date.now() - eventTime) > 5 * 60_000) return new Response("Event expired", { status: 422 });
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("sovereign_inbound_events" as "leads").insert({
      organization_id: boundOrg,
      source_tenant_id: event.source_tenant_id,
      external_event_id: event.event_id,
      booking_id: event.booking_id,
      event_type: event.event_type,
      occurred_at: event.occurred_at,
    } as never);
    if (error?.code === "23505") return Response.json({ received: true, duplicate: true });
    if (error) return new Response("Event storage unavailable", { status: 503 });
    return Response.json({ received: true, queued: false }, { status: 202 });
  } catch {
    return new Response("Connector unavailable", { status: 503 });
  }
}
