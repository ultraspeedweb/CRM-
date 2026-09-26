"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function destination(kind: "error" | "success", message: string) { return `/automation?${kind}=${encodeURIComponent(message)}`; }

export async function handoffConversationToHuman(formData: FormData) {
  const { supabase, organizationId, userId } = await requireWorkspace();
  const conversationId = String(formData.get("conversationId") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 500);
  if (!uuid.test(conversationId) || reason.length < 3) redirect(destination("error", "تحقق من المحادثة وسبب التحويل"));
  const { data, error } = await supabase.from("conversations").update({ handling_mode: "human", handoff_reason: reason, handoff_at: new Date().toISOString(), handoff_by: userId }).eq("organization_id", organizationId).eq("id", conversationId).neq("handling_mode", "human").select("id").maybeSingle();
  if (error || !data) redirect(destination("error", "تعذر تحويل المحادثة أو أنها محولة بالفعل"));
  revalidatePath("/automation"); revalidatePath("/conversations"); redirect(destination("success", "تم تحويل المحادثة إلى موظف"));
}

export async function resumeAiConversation(formData: FormData) {
  const { supabase } = await requireWorkspace();
  const conversationId = String(formData.get("conversationId") ?? "").trim();
  if (!uuid.test(conversationId)) redirect(destination("error", "معرّف المحادثة غير صالح"));
  const rpc = supabase.rpc as unknown as (fn: string, args: Record<string, string>) => Promise<{ data: boolean | null; error: { message: string } | null }>;
  const { data, error } = await rpc("resume_conversation_ai", { p_conversation_id: conversationId });
  if (error || data !== true) redirect(destination("error", "تعذر إعادة المحادثة إلى AI أو لا تملك الصلاحية"));
  revalidatePath("/automation"); revalidatePath("/conversations"); redirect(destination("success", "تمت إعادة المحادثة إلى AI"));
}
