"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";

const UUID_RE = /^[0-9a-f-]{36}$/i;
const MANAGER_ROLES = new Set(["owner", "admin", "manager"]);
function destination(kind: "error" | "success", message: string) { return `/follow-ups?${kind}=${encodeURIComponent(message)}`; }

export async function assignFollowUp(formData: FormData) {
  const { supabase, organizationId, userId, membership } = await requireWorkspace();
  const followUpId = String(formData.get("followUpId") ?? "").trim();
  const requestedAssignee = String(formData.get("assignedTo") ?? "").trim();
  if (!UUID_RE.test(followUpId) || !UUID_RE.test(requestedAssignee)) redirect(destination("error", "تعذر تعيين المتابعة"));
  const canAssignOthers = MANAGER_ROLES.has(membership.role);
  if (!canAssignOthers && requestedAssignee !== userId) redirect(destination("error", "ليس لديك صلاحية لتعيين المهمة لموظف آخر"));
  const { data: targetMember, error: memberError } = await supabase.from("organization_members").select("user_id").eq("organization_id", organizationId).eq("user_id", requestedAssignee).eq("status", "active").maybeSingle();
  if (memberError || !targetMember) redirect(destination("error", "الموظف المحدد غير متاح في هذه المؤسسة"));
  const { data: updated, error } = await supabase.from("follow_ups").update({ assigned_to: requestedAssignee }).eq("organization_id", organizationId).eq("id", followUpId).in("status", ["pending", "in_progress"]).select("id,subject,due_at").maybeSingle();
  if (error || !updated) redirect(destination("error", "تعذر تحديث مسؤول المتابعة"));
  const writes: PromiseLike<unknown>[] = [supabase.from("audit_logs").insert({ organization_id: organizationId, actor_user_id: userId, action: "follow_up.assigned", entity_type: "follow_up", entity_id: followUpId, metadata: { assigned_to: requestedAssignee } })];
  if (requestedAssignee !== userId) writes.push(supabase.from("notifications").insert({ organization_id: organizationId, user_id: requestedAssignee, notification_type: "follow_up_assigned", title: "New follow-up assigned", body: updated.subject || "A follow-up was assigned to you", entity_type: "follow_up", entity_id: followUpId }));
  await Promise.all(writes);
  revalidatePath("/follow-ups"); revalidatePath("/dashboard");
  redirect(destination("success", "تم تعيين المتابعة"));
}
