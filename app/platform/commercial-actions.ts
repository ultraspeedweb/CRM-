"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Status = "submitted"|"in_review"|"quoted"|"closed";
const nextStatus: Record<Status,Status|undefined> = {submitted:"in_review",in_review:undefined,quoted:undefined,closed:undefined};
export async function advanceCommercialRequest(form:FormData) {
  const id=String(form.get("requestId")??"");
  const current=String(form.get("currentStatus")??"") as Status;
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(id) || !Object.prototype.hasOwnProperty.call(nextStatus,current) || !nextStatus[current]) return;
  const supabase=await createClient();
  const { data:auth }=await supabase.auth.getUser();
  if (!auth.user) return;
  // Review only. Quoting, closing and activation require a verified commercial workflow.
  type PlatformAuthClient = { rpc(name:"get_platform_company_overview"):Promise<{error:unknown}> };
  const {error}=await (supabase as unknown as PlatformAuthClient).rpc("get_platform_company_overview");
  if (error) return;
  type Table={from(name:"commercial_activation_requests"):{update(values:{status:Status;reviewed_by:string;reviewed_at:string}):{eq(column:string,value:string):{eq(column:string,value:string):Promise<{error:unknown;count:number|null}>}}}};
  const admin=createAdminClient() as unknown as Table;
  const {error:updateError}=await admin.from("commercial_activation_requests").update({status:nextStatus[current]!,reviewed_by:auth.user.id,reviewed_at:new Date().toISOString()}).eq("id",id).eq("status",current);
  if (!updateError) revalidatePath("/platform");
}
