import { redirect } from "next/navigation";
import { Building2, CreditCard, Download, ShieldCheck, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PlatformPrintButton } from "./print-button";
import { setPlatformServiceStatus } from "./actions";

export const dynamic = "force-dynamic";

type Company = { organization_id:string; organization_name:string; created_at:string; member_count:number; plan_id:string|null; subscription_status:string|null; billing_cycle:string|null; included_users:number|null; trial_ends_at:string|null; current_period_end:string|null };
type PlatformRpcClient = { rpc:(name:"get_platform_company_overview" | "get_platform_service_overview")=>Promise<{data:unknown;error:unknown}> };
type ServiceControl = { organization_id:string; service_key:string; status:string; reason:string|null; updated_at:string };
const serviceKeys = ["web_inbox","whatsapp","ai_sales_agent","automations","notifications","shopify","woocommerce"] as const;
function isServiceControl(value:unknown):value is ServiceControl { if (!value || typeof value!=="object") return false; const row=value as Record<string,unknown>; return typeof row.organization_id==="string" && typeof row.service_key==="string" && typeof row.status==="string"; }
function isCompany(value:unknown):value is Company { if(!value||typeof value!=="object") return false; const row=value as Record<string,unknown>; return typeof row.organization_id==="string"&&typeof row.organization_name==="string"&&typeof row.member_count==="number"; }

export default async function PlatformPage(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
 const {data,error}=await (supabase as unknown as PlatformRpcClient).rpc("get_platform_company_overview"); if(error) redirect("/dashboard");
 const {data:serviceData,error:serviceError}=await (supabase as unknown as PlatformRpcClient).rpc("get_platform_service_overview");
 const controls=!serviceError && Array.isArray(serviceData)?serviceData.filter(isServiceControl):[];
 const companies=Array.isArray(data)?data.filter(isCompany):[]; const active=companies.filter(c=>c.subscription_status==="active").length; const trials=companies.filter(c=>c.subscription_status==="trial").length; const seats=companies.reduce((sum,c)=>sum+Number(c.member_count??0),0);
 return <main className="content">
  <div className="page-header"><div><span className="eyebrow">SatışDesk Control Plane</span><h1>Platform Operations</h1><p>Commercial health without exposing tenant customer content.</p></div><div className="header-actions"><a className="secondary-button" href="/platform/export"><Download size={17}/> CSV / Excel</a><PlatformPrintButton/></div></div>
  <section className="metrics-grid"><article className="metric-card"><div className="metric-icon blue"><Building2 size={21}/></div><div><p>Companies</p><strong>{companies.length}</strong><small>registered tenants</small></div></article><article className="metric-card"><div className="metric-icon green"><CreditCard size={21}/></div><div><p>Active subscriptions</p><strong>{active}</strong><small>{trials} trials</small></div></article><article className="metric-card"><div className="metric-icon violet"><UsersRound size={21}/></div><div><p>Active seats</p><strong>{seats}</strong><small>across companies</small></div></article><article className="metric-card"><div className="metric-icon amber"><ShieldCheck size={21}/></div><div><p>Data boundary</p><strong>Metadata only</strong><small>no leads, messages or conversations</small></div></article></section>
  <section className="panel"><div className="panel-head"><div><h2>Companies & subscriptions</h2><p>Plan, quota and lifecycle visibility for platform operations.</p></div></div><div className="table-wrap"><table><thead><tr><th>Company</th><th>Created</th><th>Plan</th><th>Status</th><th>Seats</th><th>Billing</th></tr></thead><tbody>{companies.map(company=><tr key={company.organization_id}><td><strong>{company.organization_name}</strong><small style={{display:"block"}}>{company.organization_id.slice(0,8)}</small></td><td>{new Date(company.created_at).toLocaleDateString()}</td><td>{company.plan_id??"—"}</td><td><span className={`status ${company.subscription_status==="active"?"won":"new"}`}>{company.subscription_status??"not configured"}</span></td><td>{company.member_count} / {company.included_users??"—"}</td><td>{company.billing_cycle??"—"}</td></tr>)}{!companies.length&&<tr><td colSpan={6}><div className="empty-state"><Building2 size={28}/><strong>No companies yet</strong></div></td></tr>}</tbody></table></div></section>
  <section className="panel"><div className="panel-head"><div><h2>Tenant service controls</h2><p>Changes are permission-checked and audited on the server. Unconfigured services are enabled by default.</p></div></div>
  {serviceError ? <p role="alert">Service controls are unavailable; no changes can be made.</p> : <div className="table-wrap"><table><thead><tr><th>Company</th><th>Service</th><th>Current state</th><th>Update</th></tr></thead><tbody>
    {companies.flatMap(company=>serviceKeys.map(key=>{const existing=controls.find(c=>c.organization_id===company.organization_id && c.service_key===key); return <tr key={`${company.organization_id}-${key}`}><td>{company.organization_name}</td><td>{key.replaceAll("_"," ")}</td><td>{existing?.status??"enabled (default)"}</td><td><form action={setPlatformServiceStatus} className="stack-form"><input type="hidden" name="organization_id" value={company.organization_id}/><input type="hidden" name="service_key" value={key}/><label>New state<select name="status" required defaultValue={existing?.status??"enabled"}><option value="enabled">Enabled</option><option value="disabled">Disabled</option><option value="suspended">Suspended</option></select></label><label>Reason (required to restrict)<input name="reason" maxLength={500} placeholder="Reason for change"/></label><button className="secondary-button" type="submit">Save status</button></form></td></tr>;}))}
  </tbody></table></div>}
  </section>
  <p className="muted">Print / PDF opens the browser print dialog; choose “Save as PDF”. CSV opens directly in Excel and remains limited to platform metadata.</p>
 </main>;
}
