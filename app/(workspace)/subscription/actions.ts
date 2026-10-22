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

export async function acceptCommercialOffer(form:FormData) {
 const {supabase,membership}=await requireWorkspace();
 if(!["owner","admin"].includes(membership.role)) redirect("/subscription?result=forbidden");
 const id=String(form.get("proposalId")??"");
 if(!/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(id)) redirect("/subscription?result=invalid");
 type AcceptRpc={rpc(name:"accept_commercial_proposal",args:{p_proposal_id:string}):Promise<{data:boolean|null;error:unknown}>};
 const {data,error}=await (supabase as unknown as AcceptRpc).rpc("accept_commercial_proposal",{p_proposal_id:id});
 redirect(!error&&data===true?"/subscription?result=accepted":"/subscription?result=failed");
}
