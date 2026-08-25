const leadSources = new Set(["manual", "whatsapp", "web", "instagram", "facebook", "referral"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type LeadInput = {
  fullName: string;
  phone: string;
  email: string;
  sourceChannel: string;
};

export function parseLeadInput(formData: FormData): LeadInput | null {
  const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 160);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const requestedSource = String(formData.get("sourceChannel") ?? "manual");

  if (fullName.length < 2) return null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return {
    fullName,
    phone,
    email,
    sourceChannel: leadSources.has(requestedSource) ? requestedSource : "manual",
  };
}

export function parseFollowUpInput(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim().slice(0, 200);
  const dueAt = String(formData.get("dueAt") ?? "");
  const localDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dueAt)
    ? `${dueAt}:00+03:00`
    : dueAt;
  const dueDate = new Date(localDateTime);

  if (!uuidPattern.test(leadId)) return null;
  if (subject.length < 2 || !dueAt || Number.isNaN(dueDate.getTime())) return null;

  return { leadId, subject, dueAt: dueDate.toISOString() };
}

export function isStrongEnoughPassword(password: string) {
  return password.length >= 10 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function parseIstanbulDateTime(value: string) {
  const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00+03:00` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseAppointmentInput(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const startsAt = parseIstanbulDateTime(String(formData.get("startsAt") ?? ""));
  const durationMinutes = Number(formData.get("durationMinutes") ?? 60);
  const location = String(formData.get("location") ?? "").trim().slice(0, 240);
  if (!uuidPattern.test(leadId) || !title || !startsAt || !Number.isInteger(durationMinutes) || durationMinutes < 15 || durationMinutes > 480) return null;
  return { leadId, title, startsAt: startsAt.toISOString(), endsAt: new Date(startsAt.getTime() + durationMinutes * 60_000).toISOString(), location };
}

export function parseDealInput(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const amount = Number(formData.get("amount") ?? 0);
  const currency = String(formData.get("currency") ?? "TRY").toUpperCase();
  const stage = String(formData.get("stage") ?? "qualification");
  const probability = Number(formData.get("probability") ?? 20);
  if (!uuidPattern.test(leadId) || !title || !Number.isFinite(amount) || amount < 0 || !/^[A-Z]{3}$/.test(currency)) return null;
  if (!["qualification", "proposal", "negotiation", "won"].includes(stage) || !Number.isInteger(probability) || probability < 0 || probability > 100) return null;
  return { leadId, title, amount, currency, stage, probability };
}
