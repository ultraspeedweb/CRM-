"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";

const UUID_RE = /^[0-9a-f-]{36}$/i;
const MANAGER_ROLES = new Set(["owner", "admin", "manager"]);

function destination(kind: "error" | "success", message: string) {
  return `/follow-ups?${kind}=${encodeURIComponent(message)}`;
}

export async function escalateFollowUp(formData: FormData) {
  const { supabase, organizationId, userId, membership } = await requireWorkspace();
  if (!MANAGER_ROLES.has(membership.role)) redirect(destination("error", "ليس لديك صلاحية للتصعيد"));

  const followUpId = String(formData.get("followUpId") ?? "").trim();
  const escalatedTo = String(formData.get("escalatedTo") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  if (!UUID_RE.test(followUpId) || !UUID_RE.test(escalatedTo) || !reason || reason.length > 500) {
    redirect(destination("error", "بيانات التصعيد غير صالحة"));
  }

  const [{ data: followUp }, { data: targetMember }] = await Promise.all([
    supabase.from("follow_ups").select("id").eq("organization_id", organizationId).eq("id", followUpId).in("status", ["pending", "in_progress"]).maybeSingle(),
    supabase.from("organization_members").select("user_id").eq("organization_id", organizationId).eq("user_id", escalatedTo).eq("status", "active").maybeSingle(),
  ]);
  if (!followUp || !targetMember) redirect(destination("error", "تعذر التصعيد ضمن هذه المؤسسة"));

  const { data: escalation, error } = await supabase.from("follow_up_escalations").insert({
    organization_id: organizationId,
    follow_up_id: followUpId,
    escalated_to: escalatedTo,
    escalated_by: userId,
    reason,
  }).select("id").single();
  if (error || !escalation) redirect(destination("error", "المتابعة مصعّدة بالفعل أو تعذر إنشاء التصعيد"));

  await supabase.from("audit_logs").insert({
    organization_id: organizationId,
    actor_user_id: userId,
    action: "follow_up.escalated",
    entity_type: "follow_up",
    entity_id: followUpId,
    metadata: { escalation_id: escalation.id, escalated_to: escalatedTo, reason },
  });
  revalidatePath("/follow-ups"); revalidatePath("/dashboard");
  redirect(destination("success", "تم تصعيد المتابعة"));
}

export async function resolveFollowUpEscalation(formData: FormData) {
  const { supabase, organizationId, userId, membership } = await requireWorkspace();
  if (!MANAGER_ROLES.has(membership.role)) redirect(destination("error", "ليس لديك صلاحية لإغلاق التصعيد"));
  const escalationId = String(formData.get("escalationId") ?? "").trim();
  if (!UUID_RE.test(escalationId)) redirect(destination("error", "معرف التصعيد غير صالح"));

  const resolvedAt = new Date().toISOString();
  const { data: resolved, error } = await supabase.from("follow_up_escalations").update({
    status: "resolved", resolved_by: userId, resolved_at: resolvedAt, updated_at: resolvedAt,
  }).eq("organization_id", organizationId).eq("id", escalationId).eq("status", "open").select("id,follow_up_id").maybeSingle();
  if (error || !resolved) redirect(destination("error", "تعذر إغلاق التصعيد"));

  await supabase.from("audit_logs").insert({
    organization_id: organizationId,
    actor_user_id: userId,
    action: "follow_up.escalation_resolved",
    entity_type: "follow_up",
    entity_id: resolved.follow_up_id,
    metadata: { escalation_id: resolved.id },
  });
  revalidatePath("/follow-ups"); revalidatePath("/dashboard");
  redirect(destination("success", "تم إغلاق التصعيد"));
}
