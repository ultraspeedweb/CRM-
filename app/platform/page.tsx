import { redirect } from "next/navigation";
import { Building2, CreditCard, ShieldCheck, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Company = {
  organization_id: string;
  organization_name: string;
  created_at: string;
  member_count: number;
  plan_id: string | null;
  subscription_status: string | null;
  billing_cycle: string | null;
  included_users: number | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
};

type PlatformRpcClient = {
  rpc: (name: "get_platform_company_overview") => Promise<{ data: unknown; error: unknown }>;
};

function isCompany(value: unknown): value is Company {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.organization_id === "string"
    && typeof row.organization_name === "string"
    && typeof row.member_count === "number";
}

export default async function PlatformPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // This RPC is introduced by the same closure slice. Keep the generated tenant
  // Database type strict while validating the new control-plane boundary here.
  const { data, error } = await (supabase as unknown as PlatformRpcClient).rpc("get_platform_company_overview");
  if (error) redirect("/dashboard");
  const companies = Array.isArray(data) ? data.filter(isCompany) : [];
  const active = companies.filter((c) => c.subscription_status === "active").length;
  const trials = companies.filter((c) => c.subscription_status === "trial").length;
  const seats = companies.reduce((sum, c) => sum + Number(c.member_count ?? 0), 0);

  return <main className="content">
    <div className="page-header"><div><span className="eyebrow">SatışDesk Control Plane</span><h1>Platform Operations</h1><p>Commercial health without exposing tenant customer content.</p></div></div>
    <section className="metrics-grid">
      <article className="metric-card"><div className="metric-icon blue"><Building2 size={21}/></div><div><p>Companies</p><strong>{companies.length}</strong><small>registered tenants</small></div></article>
      <article className="metric-card"><div className="metric-icon green"><CreditCard size={21}/></div><div><p>Active subscriptions</p><strong>{active}</strong><small>{trials} trials</small></div></article>
      <article className="metric-card"><div className="metric-icon violet"><UsersRound size={21}/></div><div><p>Active seats</p><strong>{seats}</strong><small>across companies</small></div></article>
      <article className="metric-card"><div className="metric-icon amber"><ShieldCheck size={21}/></div><div><p>Data boundary</p><strong>Metadata only</strong><small>no leads, messages or conversations</small></div></article>
    </section>
    <section className="panel"><div className="panel-head"><div><h2>Companies & subscriptions</h2><p>Plan, quota and lifecycle visibility for platform operations.</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Company</th><th>Plan</th><th>Status</th><th>Seats</th><th>Billing</th></tr></thead><tbody>
        {companies.map((company)=><tr key={company.organization_id}><td><strong>{company.organization_name}</strong></td><td>{company.plan_id ?? "—"}</td><td><span className={`status ${company.subscription_status === "active" ? "won" : "new"}`}>{company.subscription_status ?? "not configured"}</span></td><td>{company.member_count} / {company.included_users ?? "—"}</td><td>{company.billing_cycle ?? "—"}</td></tr>)}
        {!companies.length&&<tr><td colSpan={5}><div className="empty-state"><Building2 size={28}/><strong>No companies yet</strong><span>New tenant onboarding will appear here.</span></div></td></tr>}
      </tbody></table></div>
    </section>
  </main>;
}
