import { NextResponse } from "next/server";
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
};

type PlatformRpcClient = {
  rpc: (name: "get_platform_company_overview") => Promise<{ data: unknown; error: unknown }>;
};

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", "https://satisdesk.com"));

  const { data, error } = await (supabase as unknown as PlatformRpcClient).rpc("get_platform_company_overview");
  if (error || !Array.isArray(data)) return new NextResponse("Forbidden", { status: 403 });

  const companies = data as Company[];
  const rows = [
    ["Company", "Created", "Plan", "Status", "Active seats", "Included seats", "Billing"],
    ...companies.map((c) => [c.organization_name, c.created_at, c.plan_id, c.subscription_status, c.member_count, c.included_users, c.billing_cycle]),
  ];
  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="satisdesk-companies-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
