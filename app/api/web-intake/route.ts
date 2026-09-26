import { createHash, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type IntakeBody={organizationId?:string;name?:string;email?:string;phone?:string;message?:string;threadId?:string;language?:"ar"|"tr"|"en"|"unknown"};
const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const digest=(value:string)=>createHash("sha256").update(value).digest();
function authorized(request:Request){const expected=process.env.WEB_INTAKE_SECRET;const supplied=request.headers.get("x-satisdesk-intake-secret");if(!expected||!supplied)return false;const a=digest(expected),b=digest(supplied);return timingSafeEqual(a,b);}

export async function POST(request:Request){
 if(!process.env.SUPABASE_SECRET_KEY||!process.env.WEB_INTAKE_SECRET)return new Response("Connector not configured",{status:503});
 if(!authorized(request))return new Response("Unauthorized",{status:401});
 let body:IntakeBody;try{body=await request.json();}catch{return new Response("Invalid JSON",{status:400});}
 const organizationId=String(body.organizationId??"").trim();const name=String(body.name??"").trim().slice(0,160);const email=String(body.email??"").trim().toLowerCase().slice(0,320);const phone=String(body.phone??"").trim().slice(0,40);const text=String(body.message??"").trim().slice(0,10000);const threadId=String(body.threadId??"").trim().slice(0,200);const language=["ar","tr","en","unknown"].includes(body.language??"")?body.language:"unknown";
 if(!UUID_RE.test(organizationId)||!name||!text||(!email&&!phone))return new Response("Invalid intake",{status:400});
 const supabase=createAdminClient();const {data:org}=await supabase.from("organizations").select("id").eq("id",organizationId).maybeSingle();if(!org)return new Response("Unknown organization",{status:404});
 const identity=email?`email:${email}`:`phone:${phone}`;const externalRef=`web:${identity}`;
 let {data:lead}=await supabase.from("leads").select("id").eq("organization_id",organizationId).eq("external_ref",externalRef).maybeSingle();
 if(!lead){const created=await supabase.from("leads").insert({organization_id:organizationId,full_name:name,email:email||null,phone:phone||null,external_ref:externalRef,source_channel:"web",preferred_language:language}).select("id").single();if(created.error)return new Response("Lead creation failed",{status:500});lead=created.data;}
 if(!lead)return new Response("Lead resolution failed",{status:500});
 const externalThreadId=threadId?`web:${threadId}`:`web:${lead.id}`;
 let {data:conversation}=await supabase.from("conversations").select("id,unread_count").eq("organization_id",organizationId).eq("channel","web").eq("external_thread_id",externalThreadId).maybeSingle();
 const now=new Date().toISOString();
 if(!conversation){const created=await supabase.from("conversations").insert({organization_id:organizationId,lead_id:lead.id,channel:"web",external_thread_id:externalThreadId,status:"open",customer_language:language,unread_count:1,last_message_at:now}).select("id,unread_count").single();if(created.error)return new Response("Conversation creation failed",{status:500});conversation=created.data;}else{const next=(conversation.unread_count??0)+1;const updated=await supabase.from("conversations").update({status:"open",customer_language:language,last_message_at:now,unread_count:next}).eq("organization_id",organizationId).eq("id",conversation.id);if(updated.error)return new Response("Conversation update failed",{status:500});}
 if(!conversation)return new Response("Conversation resolution failed",{status:500});
 const {error}=await supabase.from("messages").insert({organization_id:organizationId,conversation_id:conversation.id,direction:"inbound",sender_type:"customer",message_type:"text",original_text:text,original_language:language,delivery_status:"received",sent_at:now,raw_payload:{source:"web-intake"}});if(error)return new Response("Message creation failed",{status:500});
 return Response.json({received:true,conversationId:conversation.id},{status:201});
}