import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { QuoteDatabase } from "./quote-database.types";
import { reconcileRevenueGraph, summarizeRevenueGraph, type RevenueGraphRecord } from "./revenue-graph";
import { assembleRevenueGraphRecords } from "./revenue-graph-assembly";

type AppClient = SupabaseClient<Database>;

export async function loadRevenueGraphForOrganization(
  supabase: AppClient,
  organizationId: string,
): Promise<RevenueGraphRecord[]> {
  const dealsResult = await supabase
    .from("deals")
    .select("id,organization_id,lead_id,owner_user_id,stage,stage_entered_at,amount,currency,closed_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (dealsResult.error) {
    throw new Error(`Revenue Graph deals lookup failed (${dealsResult.error.code}).`);
  }

  const deals = dealsResult.data ?? [];
  if (!deals.length) return [];

  const leadIds = [...new Set(deals.map((deal) => deal.lead_id))];
  const dealIds = deals.map((deal) => deal.id);

  const quoteDb = supabase as unknown as SupabaseClient<QuoteDatabase>;
  const sourceIds: string[] = [];

  const [leadsResult, quotesResult] = await Promise.all([
    supabase
      .from("leads")
      .select("id,organization_id,branch_id,source_id,source_channel,external_ref,campaign_name,utm_source,utm_medium,utm_campaign")
      .eq("organization_id", organizationId)
      .in("id", leadIds),
    quoteDb
      .from("quotes")
      .select("id,organization_id,deal_id,total,currency,accepted_at")
      .eq("organization_id", organizationId)
      .eq("status", "accepted")
      .in("deal_id", dealIds)
      .order("accepted_at", { ascending: false, nullsFirst: false }),
  ]);

  if (leadsResult.error) {
    throw new Error(`Revenue Graph leads lookup failed (${leadsResult.error.code}).`);
  }
  if (quotesResult.error) {
    throw new Error(`Revenue Graph quote lookup failed (${quotesResult.error.code}).`);
  }

  for (const lead of leadsResult.data ?? []) if (lead.source_id) sourceIds.push(lead.source_id);

  const sourcesResult = sourceIds.length
    ? await supabase
        .from("lead_sources")
        .select("id,organization_id,name,channel,external_account_id")
        .eq("organization_id", organizationId)
        .in("id", [...new Set(sourceIds)])
    : { data: [], error: null };

  if (sourcesResult.error) {
    throw new Error(`Revenue Graph source lookup failed (${sourcesResult.error.code}).`);
  }

  return assembleRevenueGraphRecords({
    organizationId,
    deals,
    leads: leadsResult.data ?? [],
    acceptedQuotes: quotesResult.data ?? [],
    sources: sourcesResult.data ?? [],
  });
}
export async function loadRevenueGraphSnapshotForOrganization(
  supabase: AppClient,
  organizationId: string,
) {
  const records = await loadRevenueGraphForOrganization(supabase, organizationId);
  return {
    version: "deal-v1" as const,
    records,
    summary: summarizeRevenueGraph(records),
    reconciliation: reconcileRevenueGraph(records),
    capabilities: {
      realizedRevenue: true,
      employeeAttribution: true,
      channelAttribution: true,
      branchAttribution: true,
      quoteEvidence: true,
      productAttribution: false,
      marginAttribution: false,
      goalContribution: false,
      teamAttribution: false,
      orderAttribution: false,
    } as const,
  };
}