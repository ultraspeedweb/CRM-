"use server";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/workspace";

export async function requestCommercialActivation(form: FormData) {
  const { supabase, organizationId, userId, membership } = await requireWorkspace();
  if (!["owner","admin"].includes(membership.role)) redirect("/subscription?result=forbidden");
  const email = String(form.get("email") ?? "").trim();
  const plan = String(form.get("plan") ?? "").trim();
  const notes = String(form.get("notes") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !["starter","growth","business","enterprise","pilot"].includes(plan) || notes.length > 1000) {
    redirect("/subscription?result=invalid");
  }
  type RequestClient = { from(name: "commercial_activation_requests"): {
    insert(payload: { organization_id:string;requested_by:string;contact_email:string;desired_plan:string;notes:string }): Promise<{error: {code?:string}|null}>
  }};
  const { error } = await (supabase as unknown as RequestClient).from("commercial_activation_requests").insert({
    organization_id:organizationId,requested_by:userId,contact_email:email,desired_plan:plan,notes,
  });
  redirect(error ? `/subscription?result=${error.code==="23505"?"existing":"failed"}` : "/subscription?result=submitted");
}
