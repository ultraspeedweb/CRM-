import { buildRevenueGraphRecord, type RevenueGraphRecord } from "./revenue-graph";

export type RevenueDealRow = {
  id: string; organization_id: string; lead_id: string; owner_user_id: string | null; stage: string;
  stage_entered_at: string | null; amount: number | null; currency: string; closed_at: string | null;
};
export type RevenueLeadRow = {
  id: string; organization_id: string; branch_id: string | null; source_id: string | null; source_channel: string | null;
  external_ref: string | null; campaign_name: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
};
export type RevenueQuoteRow = {
  id: string; organization_id: string; deal_id: string; total: number; currency: string; accepted_at: string | null;
};
export type RevenueSourceRow = { id: string; organization_id: string; name: string; channel: string; external_account_id: string | null };

function assertTenantRows<T extends { organization_id: string }>(organizationId: string, rows: T[], label: string): void {
  if (rows.some((row) => row.organization_id !== organizationId)) {
    throw new Error(`Revenue Graph ${label} contained cross-tenant data.`);
  }
}

export function assembleRevenueGraphRecords(args: {
  organizationId: string;
  deals: RevenueDealRow[];
  leads: RevenueLeadRow[];
  acceptedQuotes: RevenueQuoteRow[];
  sources: RevenueSourceRow[];
}): RevenueGraphRecord[] {
  const { organizationId, deals, leads, acceptedQuotes, sources } = args;
  assertTenantRows(organizationId, deals, "deals");
  assertTenantRows(organizationId, leads, "leads");
  assertTenantRows(organizationId, acceptedQuotes, "quotes");
  assertTenantRows(organizationId, sources, "sources");

  const leadsById = new Map(leads.map((lead) => [lead.id, lead]));
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const acceptedQuoteByDeal = new Map<string, RevenueQuoteRow>();
  for (const quote of acceptedQuotes) if (!acceptedQuoteByDeal.has(quote.deal_id)) acceptedQuoteByDeal.set(quote.deal_id, quote);

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
      sourceExternalAccountId: source?.external_account_id ?? null,
      leadExternalRef: lead?.external_ref ?? null,
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