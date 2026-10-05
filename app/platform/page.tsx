import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, CreditCard, Download, ShieldCheck, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLocale, localeMeta } from "@/lib/i18n";
import { PlatformPrintButton } from "./print-button";

export const dynamic = "force-dynamic";

type Company = { organization_id:string; organization_name:string; created_at:string; member_count:number; plan_id:string|null; subscription_status:string|null; billing_cycle:string|null; included_users:number|null; trial_ends_at:string|null; current_period_end:string|null };
type PlatformRpcClient = { rpc:(name:"get_platform_company_overview")=>Promise<{data:unknown;error:unknown}> };
function isCompany(value:unknown):value is Company { if(!value||typeof value!=="object") return false; const row=value as Record<string,unknown>; return typeof row.organization_id==="string"&&typeof row.organization_name==="string"&&typeof row.member_count==="number"; }

const accessCopy = {
 ar: { title: "تعذر فتح لوحة إدارة المنصة", body: "قد لا يملك هذا الحساب صلاحية إدارة المنصة، أو تعذر التحقق من الصلاحية الآن. لم يتم منح أي وصول بديل.", back: "العودة للرئيسية" },
 tr: { title: "Platform yönetimi açılamadı", body: "Bu hesabın platform yönetim yetkisi olmayabilir veya yetki şu anda doğrulanamadı. Alternatif erişim verilmedi.", back: "Ana sayfaya dön" },
 en: { title: "Platform control unavailable", body: "This account may not have platform authority, or that authority could not be verified. No fallback access was granted.", back: "Back to home" },
} as const;

export default async function PlatformPage(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
 const {data,error}=await (supabase as unknown as PlatformRpcClient).rpc("get_platform_company_overview");
 if(error){
  const locale=await getLocale(); const t=accessCopy[locale];
  return <main className="center-page" dir={localeMeta[locale].dir}><section className="auth-card"><div className="brand-mark">S</div><h1>{t.title}</h1><p className="muted">{t.body}</p><Link className="primary-button" href="/">{t.back}</Link></section></main>;
 }
 const companies=Array.isArray(data)?data.filter(isCompany):[]; const active=companies.filter(c=>c.subscription_status==="active").length; const trials=companies.filter(c=>c.subscription_status==="trial").length; const seats=companies.reduce((sum,c)=>sum+Number(c.member_count??0),0);
 return <main className="content">
  <div className="page-header"><div><span className="eyebrow">SatışDesk Control Plane</span><h1>Platform Operations</h1><p>Commercial health without exposing tenant customer content.</p></div><div className="header-actions"><a className="secondary-button" href="/platform/export"><Download size={17}/> CSV / Excel</a><PlatformPrintButton/></div></div>
  <section className="metrics-grid"><article className="metric-card"><div className="metric-icon blue"><Building2 size={21}/></div><div><p>Companies</p><strong>{companies.length}</strong><small>registered tenants</small></div></article><article className="metric-card"><div className="metric-icon green"><CreditCard size={21}/></div><div><p>Active subscriptions</p><strong>{active}</strong><small>{trials} trials</small></div></article><article className="metric-card"><div className="metric-icon violet"><UsersRound size={21}/></div><div><p>Active seats</p><strong>{seats}</strong><small>across companies</small></div></article><article className="metric-card"><div className="metric-icon amber"><ShieldCheck size={21}/></div><div><p>Data boundary</p><strong>Metadata only</strong><small>no leads, messages or conversations</small></div></article></section>
  <section className="panel"><div className="panel-head"><div><h2>Companies & subscriptions</h2><p>Plan, quota and lifecycle visibility for platform operations.</p></div></div><div className="table-wrap"><table><thead><tr><th>Company</th><th>Created</th><th>Plan</th><th>Status</th><th>Seats</th><th>Billing</th></tr></thead><tbody>{companies.map(company=><tr key={company.organization_id}><td><strong>{company.organization_name}</strong><small style={{display:"block"}}>{company.organization_id.slice(0,8)}</small></td><td>{new Date(company.created_at).toLocaleDateString()}</td><td>{company.plan_id??"—"}</td><td><span className={`status ${company.subscription_status==="active"?"won":"new"}`}>{company.subscription_status??"not configured"}</span></td><td>{company.member_count} / {company.included_users??"—"}</td><td>{company.billing_cycle??"—"}</td></tr>)}{!companies.length&&<tr><td colSpan={6}><div className="empty-state"><Building2 size={28}/><strong>No companies yet</strong></div></td></tr>}</tbody></table></div></section>
  <p className="muted">Print / PDF opens the browser print dialog; choose “Save as PDF”. CSV opens directly in Excel and remains limited to platform metadata.</p>
 </main>;
}
