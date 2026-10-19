"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function advanceCommercialRequest(form: FormData) {
  const id = String(form.get("requestId") ?? "");
  const status = String(form.get("currentStatus") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(id) || status !== "submitted") return;
  const supabase = await createClient();
  type ReviewRpc = { rpc(name:"begin_commercial_activation_review",args:{p_request_id:string}):Promise<{data:boolean|null;error:unknown}> };
  // Authenticated RPC enforces platform role and transition in the database transaction.
  const {data,error}=await (supabase as unknown as ReviewRpc).rpc("begin_commercial_activation_review",{p_request_id:id});
  if (!error && data===true) revalidatePath("/platform");
}

export async function createProposalDraft(form:FormData) {
 const id=String(form.get("requestId")??"");
 const amount=String(form.get("amount")??"");
 const currency=String(form.get("currency")??"");
 const scope=String(form.get("scope")??"").trim();
 const validUntil=String(form.get("validUntil")??"");
 if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[1-9][0-9]{0,10}$/.test(amount) ||
     !["TRY","USD","EUR"].includes(currency) || scope.length<20 || scope.length>3000 ||
     !/^\\d{4}-\\d{2}-\\d{2}$/.test(validUntil)) return;
 const supabase=await createClient();
 type ProposalRpc={rpc(name:"create_commercial_proposal_draft",args:{p_request_id:string;p_amount_minor:number;p_currency:string;p_scope:string;p_valid_until:string}):Promise<{error:unknown}>};
 const {error}=await (supabase as unknown as ProposalRpc).rpc("create_commercial_proposal_draft",{
  p_request_id:id,p_amount_minor:Number(amount),p_currency:currency,p_scope:scope,p_valid_until:validUntil
 });
 if(!error) revalidatePath("/platform");
}
