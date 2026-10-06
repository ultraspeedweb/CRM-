import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { QuoteDatabase } from "./quote-database.types";
import { buildRevenueGraphRecord, reconcileRevenueGraph, summarizeRevenueGraph, type RevenueGraphRecord } from "./revenue-graph";

type AppClient = SupabaseClient<Database>;

export async function loadRevenueGraphForOrganization(
  supabase: AppClient,
  organizationId: string,
): Promise<RevenueGraphRecord[]> {
  const dealsResult = await supabase
    .from("deals")
    .select("id,lead_id,owner_user_id,stage,stage_entered_at,amount,currency,closed_at")
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
      .select("id,branch_id,source_id,source_channel,campaign_name,utm_source,utm_medium,utm_campaign")
      .eq("organization_id", organizationId)
      .in("id", leadIds),
    quoteDb
      .from("quotes")
      .select("id,deal_id,total,currency,accepted_at")
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
        .select("id,name,channel")
        .eq("organization_id", organizationId)
        .in("id", [...new Set(sourceIds)])
    : { data: [], error: null };

  if (sourcesResult.error) {
    throw new Error(`Revenue Graph source lookup failed (${sourcesResult.error.code}).`);
  }

  const leadsById = new Map((leadsResult.data ?? []).map((lead) => [lead.id, lead]));
  const sourcesById = new Map((sourcesResult.data ?? []).map((source) => [source.id, source]));
  type AcceptedQuoteRow = NonNullable<typeof quotesResult.data>[number];
  const acceptedQuoteByDeal = new Map<string, AcceptedQuoteRow>();
  for (const quote of quotesResult.data ?? []) {
    if (!acceptedQuoteByDeal.has(quote.deal_id)) acceptedQuoteByDeal.set(quote.deal_id, quote);
  }

  return deals.map((deal) => {
    const lead = leadsById.get(deal.lead_id);
    const quote = acceptedQuoteByDeal.get(deal.id);
    const source = lead?.source_id ? sourcesById.get(lead.source_id) : undefined;

    return buildRevenueGraphRecord({
      organizationId,
      dealId: deal.id,
      leadId: deal.lead_id,
      branchId: lead?.branch_id ?? null,
      sourceId: lead?.source_id ?? null,
      sourceChannel: source?.channel ?? lead?.source_channel ?? null,
      sourceName: source?.name ?? null,
      campaignName: lead?.campaign_name ?? null,
      utmSource: lead?.utm_source ?? null,
      utmMedium: lead?.utm_medium ?? null,
      utmCampaign: lead?.utm_campaign ?? null,
      ownerUserId: deal.owner_user_id,
      dealStage: deal.stage,
      dealStageEnteredAt: deal.stage_entered_at,
      dealAmount: deal.amount,
      dealCurrency: deal.currency,
      dealClosedAt: deal.closed_at,
      acceptedQuoteId: quote?.id ?? null,
      acceptedQuoteTotal: quote?.total ?? null,
      acceptedQuoteCurrency: quote?.currency ?? null,
      acceptedQuoteAcceptedAt: quote?.accepted_at ?? null,
    });
  });
}
export async function loadRevenueGraphSnapshotForOrganization(
  supabase: AppClient,
  organizationId: string,
) {
  const records = await loadRevenueGraphForOrganization(supabase, organizationId);
  return {
    records,
    summary: summarizeRevenueGraph(records),
    reconciliation: reconcileRevenueGraph(records),
  };
}