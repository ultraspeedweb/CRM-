import { createAdminClient } from "@/lib/supabase/admin";
import { buildWhatsAppThreadId, extractWhatsAppEvents, verifyMetaSignature } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) return new Response(challenge);
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const appSecret = process.env.META_APP_SECRET;
  const rawBody = await request.text();
  if (!appSecret || !process.env.SUPABASE_SECRET_KEY) return new Response("Connector not configured", { status: 503 });
  if (!verifyMetaSignature(rawBody, request.headers.get("x-hub-signature-256"), appSecret)) return new Response("Invalid signature", { status: 401 });

  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return new Response("Invalid JSON", { status: 400 }); }
  const supabase = createAdminClient();

  for (const event of extractWhatsAppEvents(payload)) {
    const phoneNumberId = event.metadata?.phone_number_id;
    if (!phoneNumberId) continue;

    const { data: connection, error: connectionError } = await supabase
      .from("whatsapp_connections")
      .select("organization_id")
      .eq("phone_number_id", phoneNumberId)
      .eq("status", "active")
      .maybeSingle();
    if (connectionError) return new Response("Connection lookup failed", { status: 500 });
    if (!connection) continue;
    const organizationId = connection.organization_id;

    for (const status of event.statuses ?? []) {
      const mapped = ["sent", "delivered", "read", "failed"].includes(status.status) ? status.status : "sent";
      await supabase.from("messages").update({ delivery_status: mapped, delivered_at: mapped === "delivered" ? new Date(Number(status.timestamp ?? 0) * 1000).toISOString() : undefined, read_at: mapped === "read" ? new Date(Number(status.timestamp ?? 0) * 1000).toISOString() : undefined, failure_reason: mapped === "failed" ? status.errors?.[0]?.title ?? "Meta delivery failed" : null }).eq("organization_id", organizationId).eq("external_message_id", status.id);
    }

    for (const message of event.messages ?? []) {
      const waId = message.from;
      const contactName = event.contacts?.find((contact) => contact.wa_id === waId)?.profile?.name || `WhatsApp ${waId.slice(-4)}`;
      const externalRef = `whatsapp:${waId}`;
      const externalThreadId = buildWhatsAppThreadId(phoneNumberId, waId);
      let { data: lead } = await supabase.from("leads").select("id").eq("organization_id", organizationId).eq("external_ref", externalRef).maybeSingle();
      if (!lead) {
        const created = await supabase.from("leads").insert({ organization_id: organizationId, full_name: contactName, phone: waId, whatsapp_phone: waId, external_ref: externalRef, source_channel: "whatsapp", preferred_language: "unknown" }).select("id").single();
        lead = created.data;
      }
      if (!lead) continue;

      let { data: conversation } = await supabase.from("conversations").select("id").eq("organization_id", organizationId).eq("channel", "whatsapp").eq("external_thread_id", externalThreadId).maybeSingle();
      if (!conversation) {
        const created = await supabase.from("conversations").insert({ organization_id: organizationId, lead_id: lead.id, channel: "whatsapp", external_thread_id: externalThreadId, handling_mode: "human", last_message_at: new Date(Number(message.timestamp ?? 0) * 1000).toISOString(), unread_count: 1 }).select("id").single();
        conversation = created.data;
      } else {
        await supabase.from("conversations").update({ status: "open", last_message_at: new Date(Number(message.timestamp ?? 0) * 1000).toISOString(), unread_count: 1 }).eq("organization_id", organizationId).eq("id", conversation.id);
      }
      if (!conversation) continue;

      const inserted = await supabase.from("messages").insert({ organization_id: organizationId, conversation_id: conversation.id, external_message_id: message.id, direction: "inbound", sender_type: "customer", message_type: message.type === "text" ? "text" : "system", original_text: message.text?.body ?? `[${message.type ?? "message"}]`, original_language: "unknown", delivery_status: "received", raw_payload: JSON.parse(JSON.stringify(message)) });
      if (inserted.error && inserted.error.code !== "23505") throw inserted.error;
    }
  }

  return Response.json({ received: true });
}
