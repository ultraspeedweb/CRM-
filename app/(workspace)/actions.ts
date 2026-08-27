"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireWorkspace } from "@/lib/workspace";
import { parseAppointmentInput, parseDealInput, parseFollowUpInput, parseLeadInput } from "@/lib/validation";
import { getPhoneNumberIdFromThreadId, resolveWhatsAppAccessToken } from "@/lib/whatsapp";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createLead(formData: FormData) {
  const { supabase, organizationId } = await requireWorkspace();
  const input = parseLeadInput(formData);
  if (!input) redirect("/leads?error=تحقق من اسم العميل وبيانات الاتصال");

  const { error } = await supabase.from("leads").insert({
    organization_id: organizationId,
    full_name: input.fullName,
    phone: input.phone || null,
    whatsapp_phone: input.phone || null,
    email: input.email || null,
    source_channel: input.sourceChannel,
    preferred_language: "unknown",
  });
  if (error) redirect("/leads?error=تعذر حفظ العميل");
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  redirect("/leads?success=تمت إضافة العميل");
}

export async function createFollowUp(formData: FormData) {
  const { supabase, organizationId } = await requireWorkspace();
  const input = parseFollowUpInput(formData);
  if (!input) redirect("/follow-ups?error=تحقق من العميل والموضوع وموعد الاستحقاق");
  const { error } = await supabase.from("follow_ups").insert({ organization_id: organizationId, lead_id: input.leadId, subject: input.subject, due_at: input.dueAt });
  if (error) redirect("/follow-ups?error=تعذر حفظ المتابعة");
  revalidatePath("/follow-ups");
  redirect("/follow-ups?success=تمت جدولة المتابعة");
}

export async function createAppointment(formData: FormData) {
  const { supabase, organizationId } = await requireWorkspace();
  const input = parseAppointmentInput(formData);
  if (!input) redirect("/appointments?error=تحقق من بيانات الموعد");
  const { error } = await supabase.from("appointments").insert({ organization_id: organizationId, lead_id: input.leadId, title: input.title, starts_at: input.startsAt, ends_at: input.endsAt, location: input.location || null, timezone: "Europe/Istanbul" });
  if (error) redirect("/appointments?error=تعذر حفظ الموعد");
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  redirect("/appointments?success=تمت إضافة الموعد");
}

export async function createDeal(formData: FormData) {
  const { supabase, organizationId } = await requireWorkspace();
  const input = parseDealInput(formData);
  if (!input) redirect("/deals?error=تحقق من بيانات الصفقة");
  const { error } = await supabase.from("deals").insert({ organization_id: organizationId, lead_id: input.leadId, title: input.title, amount: input.amount, currency: input.currency, stage: input.stage, probability: input.probability });
  if (error) redirect("/deals?error=تعذر حفظ الصفقة");
  revalidatePath("/deals");
  revalidatePath("/dashboard");
  redirect("/deals?success=تمت إضافة الصفقة");
}

export async function sendWhatsAppMessage(formData: FormData) {
  const { supabase, organizationId, userId } = await requireWorkspace();
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 4096);
  if (!/^[0-9a-f-]{36}$/i.test(conversationId) || !body) redirect("/conversations?error=اكتب رسالة صالحة");

  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v25.0";
  if (!process.env.SUPABASE_SECRET_KEY || !/^v\d+\.\d+$/.test(graphVersion)) redirect("/conversations?error=ربط WhatsApp غير مكتمل");

  const { data: conversation } = await supabase.from("conversations").select("id, channel, external_thread_id, leads(whatsapp_phone,phone)").eq("organization_id", organizationId).eq("id", conversationId).single();
  const lead = Array.isArray(conversation?.leads) ? conversation.leads[0] : conversation?.leads;
  const recipient = lead?.whatsapp_phone || lead?.phone;
  if (!conversation || conversation.channel !== "whatsapp" || !recipient) redirect("/conversations?error=لا يوجد رقم WhatsApp صالح لهذا العميل");

  const admin = createAdminClient();
  const routedPhoneNumberId = getPhoneNumberIdFromThreadId(conversation.external_thread_id);
  let connectionQuery = admin.from("whatsapp_connections").select("phone_number_id, access_token_env_key").eq("organization_id", organizationId).eq("status", "active");
  if (routedPhoneNumberId) connectionQuery = connectionQuery.eq("phone_number_id", routedPhoneNumberId);
  const { data: connection } = await connectionQuery.order("updated_at", { ascending: false }).limit(1).maybeSingle();
  const phoneNumberId = connection?.phone_number_id;
  const accessToken = resolveWhatsAppAccessToken(connection?.access_token_env_key);
  if (!phoneNumberId || !accessToken) redirect("/conversations?error=ربط WhatsApp غير مكتمل لهذه المؤسسة");

  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: recipient, type: "text", text: { preview_url: false, body } }),
  });
  const result = await response.json() as { messages?: Array<{ id?: string }>; error?: { message?: string } };
  if (!response.ok || !result.messages?.[0]?.id) redirect("/conversations?error=تعذر إرسال الرسالة عبر Meta");

  const now = new Date().toISOString();
  const { error } = await supabase.from("messages").insert({ organization_id: organizationId, conversation_id: conversationId, external_message_id: result.messages[0].id, direction: "outbound", sender_type: "agent", sender_user_id: userId, message_type: "text", original_text: body, original_language: "unknown", delivery_status: "sent", sent_at: now });
  if (error) redirect("/conversations?error=أُرسلت الرسالة لكن تعذر حفظها في السجل");
  await supabase.from("conversations").update({ last_message_at: now }).eq("organization_id", organizationId).eq("id", conversationId);
  revalidatePath("/conversations");
  redirect("/conversations?success=تم إرسال الرسالة");
}

export async function completeFollowUp(formData: FormData) {
  const { supabase, organizationId } = await requireWorkspace();
  const followUpId = String(formData.get("followUpId") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(followUpId)) redirect("/follow-ups?error=معرّف المتابعة غير صالح");

  const { error } = await supabase
    .from("follow_ups")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("organization_id", organizationId)
    .eq("id", followUpId)
    .in("status", ["pending", "in_progress"]);
  if (error) redirect("/follow-ups?error=تعذر إكمال المتابعة");
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
  redirect("/follow-ups?success=تم إكمال المتابعة");
}
