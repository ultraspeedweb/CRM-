import { createHmac, timingSafeEqual } from "node:crypto";

type WhatsAppMessage = { id: string; from: string; timestamp?: string; type?: string; text?: { body?: string } };
type WhatsAppStatus = { id: string; status: string; timestamp?: string; errors?: Array<{ title?: string }> };
type WhatsAppValue = { metadata?: { phone_number_id?: string }; contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>; messages?: WhatsAppMessage[]; statuses?: WhatsAppStatus[] };
type WhatsAppPayload = { object?: string; entry?: Array<{ changes?: Array<{ value?: WhatsAppValue }> }> };

const WHATSAPP_ACCESS_TOKEN_ENV_KEY = /^WHATSAPP_ACCESS_TOKEN(?:_[A-Z0-9_]+)?$/;

export function resolveWhatsAppAccessToken(envKey: string | null | undefined) {
  if (!envKey || !WHATSAPP_ACCESS_TOKEN_ENV_KEY.test(envKey)) return null;
  return process.env[envKey]?.trim() || null;
}

export function buildWhatsAppThreadId(phoneNumberId: string, waId: string) {
  return `${phoneNumberId}:${waId}`;
}

export function getPhoneNumberIdFromThreadId(threadId: string | null | undefined) {
  const match = threadId?.match(/^(\d+):\d+$/);
  return match?.[1] ?? null;
}

export function verifyMetaSignature(rawBody: string, signature: string | null, appSecret: string) {
  if (!signature?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", appSecret).update(rawBody).digest("hex"), "utf8");
  const received = Buffer.from(signature.slice(7), "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function extractWhatsAppEvents(payload: unknown) {
  const parsed = payload as WhatsAppPayload;
  if (parsed?.object !== "whatsapp_business_account") return [];
  return (parsed.entry ?? []).flatMap((entry) => (entry.changes ?? []).map((change) => change.value).filter(Boolean) as WhatsAppValue[]);
}
