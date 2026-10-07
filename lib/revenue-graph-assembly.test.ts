import { describe, expect, it } from "vitest";
import { assembleRevenueGraphRecords } from "./revenue-graph-assembly";

const deal = {
  id: "deal-1", organization_id: "org-1", lead_id: "lead-1", owner_user_id: "user-1", stage: "won",
  stage_entered_at: "2026-10-01T00:00:00.000Z", amount: 10000, currency: "TRY", closed_at: "2026-10-06T00:00:00.000Z",
};
const lead = {
  id: "lead-1", organization_id: "org-1", branch_id: "branch-1", source_id: "source-1", source_channel: "web",
  external_ref: "crm-import-42", campaign_name: "Autumn", utm_source: "google", utm_medium: "cpc", utm_campaign: "autumn",
};
const quote = {
  id: "quote-1", organization_id: "org-1", deal_id: "deal-1", total: 10000, currency: "TRY", accepted_at: "2026-10-05T00:00:00.000Z",
};
const source = { id: "source-1", organization_id: "org-1", name: "Google Ads", channel: "web", external_account_id: "ads-account-7" };

describe("Revenue Graph tenant-defensive assembly", () => {
  it("assembles governed provenance from same-tenant rows", () => {
    const [record] = assembleRevenueGraphRecords({ organizationId: "org-1", deals: [deal], leads: [lead], acceptedQuotes: [quote], sources: [source] });
    expect(record.sourceName).toBe("Google Ads");
    expect(record.sourceChannel).toBe("web");
    expect(record.sourceExternalAccountId).toBe("ads-account-7");
    expect(record.leadExternalRef).toBe("crm-import-42");
    expect(record.dealStageEnteredAt).toBe("2026-10-01T00:00:00.000Z");
    expect(record.revenueValue).toBe(10000);
  });

  it.each([["deals", { deals: [{ ...deal, organization_id: "org-2" }] }], ["leads", { leads: [{ ...lead, organization_id: "org-2" }] }], ["quotes", { acceptedQuotes: [{ ...quote, organization_id: "org-2" }] }], ["sources", { sources: [{ ...source, organization_id: "org-2" }] }]])("rejects cross-tenant %s contamination", (label, override) => {
    expect(() => assembleRevenueGraphRecords({ organizationId: "org-1", deals: [deal], leads: [lead], acceptedQuotes: [quote], sources: [source], ...override })).toThrow(`Revenue Graph ${label} contained cross-tenant data.`);
  });
});