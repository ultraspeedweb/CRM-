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
