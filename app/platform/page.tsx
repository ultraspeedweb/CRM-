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

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "2-digit" }).format(date);
}

export default async function PlatformPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // The RPC is the security boundary: platform operations receive tenant metadata,
  // never customer conversations, leads or message content.
  const { data, error } = await (supabase as unknown as PlatformRpcClient).rpc("get_platform_company_overview");
  if (error) redirect("/dashboard");
  const companies = Array.isArray(data) ? data.filter(isCompany) : [];
  const active = companies.filter((c) => c.subscription_status === "active").length;
  const trials = companies.filter((c) => c.subscription_status === "trial").length;
  const unconfigured = companies.filter((c) => !c.subscription_status).length;
  const seats = companies.reduce((sum, c) => sum + Number(c.member_count ?? 0), 0);
  const seatCapacity = companies.reduce((sum, c) => sum + Number(c.included_users ?? 0), 0);
  const overSeatLimit = companies.filter((c) => c.included_users != null && c.member_count > c.included_users).length;

  return <main className="content">
    <div className="page-header"><div><span className="eyebrow">SatışDesk Control Plane</span><h1>Platform Operations</h1><p>Commercial and tenant health without exposing tenant customer content.</p></div></div>
    <section className="metrics-grid">
      <article className="metric-card"><div className="metric-icon blue"><Building2 size={21}/></div><div><p>Companies</p><strong>{companies.length}</strong><small>{unconfigured} awaiting subscription setup</small></div></article>
      <article className="metric-card"><div className="metric-icon green"><CreditCard size={21}/></div><div><p>Active subscriptions</p><strong>{active}</strong><small>{trials} trials</small></div></article>
      <article className="metric-card"><div className="metric-icon violet"><UsersRound size={21}/></div><div><p>Seat usage</p><strong>{seats}{seatCapacity ? ` / ${seatCapacity}` : ""}</strong><small>{overSeatLimit} companies above included seats</small></div></article>
      <article className="metric-card"><div className="metric-icon amber"><ShieldCheck size={21}/></div><div><p>Data boundary</p><strong>Metadata only</strong><small>no leads, messages or conversations</small></div></article>
    </section>
    <section className="panel"><div className="panel-head"><div><h2>Companies & subscriptions</h2><p>Plan, quota and lifecycle visibility for platform operations.</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Company</th><th>Plan</th><th>Status</th><th>Seats</th><th>Billing</th><th>Trial ends</th><th>Period ends</th></tr></thead><tbody>
        {companies.map((company)=><tr key={company.organization_id}><td><strong>{company.organization_name}</strong></td><td>{company.plan_id ?? "—"}</td><td><span className={`status ${company.subscription_status === "active" ? "won" : "new"}`}>{company.subscription_status ?? "not configured"}</span></td><td>{company.member_count} / {company.included_users ?? "—"}</td><td>{company.billing_cycle ?? "—"}</td><td>{formatDate(company.trial_ends_at)}</td><td>{formatDate(company.current_period_end)}</td></tr>)}
        {!companies.length&&<tr><td colSpan={7}><div className="empty-state"><Building2 size={28}/><strong>No companies yet</strong><span>New tenant onboarding will appear here.</span></div></td></tr>}
      </tbody></table></div>
    </section>
  </main>;
}
