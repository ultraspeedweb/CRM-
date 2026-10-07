import { describe, expect, it } from "vitest";
import {
  buildRevenueGraphRecord,
  canAttributeRevenueToChannel,
  canAttributeRevenueToEmployee,
  hasBlockingRevenueGraphIssue,
  materialValueMismatch,
  summarizeRevenueGraph,
  reconcileRevenueGraph,
} from "./revenue-graph";

const base = {
  organizationId: "org-1",
  dealId: "deal-1",
  leadId: "lead-1",
  branchId: "branch-1",
  sourceId: "source-1",
  sourceChannel: "web",
  campaignName: "Autumn",
  ownerUserId: "user-1",
  dealStage: "won",
  dealAmount: 10000,
  dealCurrency: "TRY",
  dealClosedAt: "2026-10-06T08:00:00.000Z",
  acceptedQuoteId: "quote-1",
  acceptedQuoteTotal: 10000,
  acceptedQuoteCurrency: "TRY",
  acceptedQuoteAcceptedAt: "2026-10-05T08:00:00.000Z",
};

describe("Revenue Graph v1 attribution", () => {
  it("uses won deal amount as canonical revenue without silently replacing it with quote total", () => {
    const record = buildRevenueGraphRecord({ ...base, acceptedQuoteTotal: 10040 });
    expect(record.revenueOutcome).toBe(true);
    expect(record.revenueValue).toBe(10000);
    expect(record.revenueCurrency).toBe("TRY");
    expect(record.dataQualityIssues).not.toContainEqual(expect.objectContaining({ code: "accepted_quote_value_mismatch" }));
  });

  it("flags a material same-currency accepted quote mismatch", () => {
    const record = buildRevenueGraphRecord({ ...base, acceptedQuoteTotal: 10100 });
    expect(record.revenueValue).toBe(10000);
    expect(record.dataQualityIssues).toContainEqual({ code: "accepted_quote_value_mismatch", severity: "warning" });
  });

  it("flags currency mismatch and does not treat value difference as comparable", () => {
    const record = buildRevenueGraphRecord({ ...base, acceptedQuoteTotal: 9000, acceptedQuoteCurrency: "USD" });
    expect(record.dataQualityIssues).toContainEqual({ code: "accepted_quote_currency_mismatch", severity: "warning" });
    expect(record.dataQualityIssues).not.toContainEqual(expect.objectContaining({ code: "accepted_quote_value_mismatch" }));
  });

  it("fails revenue quality closed when a won deal lacks value or close timestamp", () => {
    const record = buildRevenueGraphRecord({ ...base, dealAmount: null, dealClosedAt: null });
    expect(record.dataQualityIssues).toContainEqual({ code: "missing_revenue_value", severity: "blocking" });
    expect(record.dataQualityIssues).toContainEqual({ code: "won_without_closed_at", severity: "blocking" });
    expect(hasBlockingRevenueGraphIssue(record)).toBe(true);
    expect(canAttributeRevenueToEmployee(record)).toBe(false);
    expect(canAttributeRevenueToChannel(record)).toBe(false);
  });

  it("keeps total revenue usable but blocks employee/channel attribution when dimensions are missing", () => {
    const record = buildRevenueGraphRecord({ ...base, ownerUserId: null, sourceId: null, sourceChannel: null });
    expect(hasBlockingRevenueGraphIssue(record)).toBe(false);
    expect(record.dataQualityIssues).toContainEqual({ code: "missing_responsible_actor", severity: "warning" });
    expect(record.dataQualityIssues).toContainEqual({ code: "missing_source_attribution", severity: "warning" });
    expect(canAttributeRevenueToEmployee(record)).toBe(false);
    expect(canAttributeRevenueToChannel(record)).toBe(false);
    expect(record.revenueValue).toBe(10000);
  });

  it("does not call revenue channel-attributed from a source id without a resolved channel", () => {
    const record = buildRevenueGraphRecord({ ...base, sourceId: "source-1", sourceChannel: null });
    expect(record.revenueValue).toBe(10000);
    expect(canAttributeRevenueToChannel(record)).toBe(false);
  });
  it("does not report open pipeline as realized revenue", () => {
    const record = buildRevenueGraphRecord({ ...base, dealStage: "negotiation", dealClosedAt: null });
    expect(record.revenueOutcome).toBe(false);
    expect(record.revenueValue).toBeNull();
    expect(record.dataQualityIssues).toEqual([]);
  });

  it("keeps product and goal attribution explicitly unavailable until their workstreams exist", () => {
    const record = buildRevenueGraphRecord(base);
    expect(record.productAttribution).toBe("not_yet_available");
    expect(record.goalContribution).toBe("not_yet_available");
  });
});

describe("materialValueMismatch", () => {
  it("uses the larger of one currency unit or 0.5 percent", () => {
    expect(materialValueMismatch(10000, 10050)).toBe(false);
    expect(materialValueMismatch(10000, 10050.01)).toBe(true);
    expect(materialValueMismatch(100, 101)).toBe(false);
    expect(materialValueMismatch(100, 101.01)).toBe(true);
  });
});
describe("Revenue Graph summary", () => {
  it("never mixes currencies into one revenue total", () => {
    const tryRecord = buildRevenueGraphRecord(base);
    const usdRecord = buildRevenueGraphRecord({ ...base, dealId: "deal-2", dealAmount: 500, dealCurrency: "USD", acceptedQuoteCurrency: "USD", acceptedQuoteTotal: 500 });
    const summary = summarizeRevenueGraph([tryRecord, usdRecord]);
    expect(summary.byCurrency).toEqual([
      expect.objectContaining({ currency: "TRY", realizedRevenue: 10000 }),
      expect.objectContaining({ currency: "USD", realizedRevenue: 500 }),
    ]);
  });

  it("excludes blocking records from realized totals but keeps their quality evidence", () => {
    const blocked = buildRevenueGraphRecord({ ...base, dealId: "deal-3", dealAmount: null });
    const summary = summarizeRevenueGraph([buildRevenueGraphRecord(base), blocked]);
    expect(summary.byCurrency).toEqual([expect.objectContaining({ currency: "TRY", realizedRevenue: 10000, revenueOutcomeCount: 1 })]);
    expect(summary.qualityIssueCounts.missing_revenue_value).toBe(1);
    expect(summary.recordCount).toBe(2);
    expect(summary.revenueOutcomeCount).toBe(1);
  });

  it("only counts employee/channel attribution when those dimensions are trustworthy", () => {
    const incomplete = buildRevenueGraphRecord({ ...base, dealId: "deal-4", ownerUserId: null, sourceId: null, sourceChannel: null });
    const summary = summarizeRevenueGraph([buildRevenueGraphRecord(base), incomplete]);
    expect(summary.byCurrency[0]).toMatchObject({
      currency: "TRY",
      realizedRevenue: 20000,
      employeeAttributedRevenue: 10000,
      channelAttributedRevenue: 10000,
    });
  });
});
describe("Revenue Graph reconciliation", () => {
  it("separates total-revenue usability from employee/channel attribution usability", () => {
    const incomplete = buildRevenueGraphRecord({ ...base, dealId: "deal-r1", ownerUserId: null, sourceId: null, sourceChannel: null });
    const [row] = reconcileRevenueGraph([incomplete]);
    expect(row.usableForTotalRevenue).toBe(true);
    expect(row.usableForEmployeeAttribution).toBe(false);
    expect(row.usableForChannelAttribution).toBe(false);
    expect(row.warningIssues).toEqual(expect.arrayContaining(["missing_responsible_actor", "missing_source_attribution"]));
  });

  it("marks missing won value as unusable for all realized-revenue attribution", () => {
    const blocked = buildRevenueGraphRecord({ ...base, dealId: "deal-r2", dealAmount: null });
    const [row] = reconcileRevenueGraph([blocked]);
    expect(row.usableForTotalRevenue).toBe(false);
    expect(row.usableForEmployeeAttribution).toBe(false);
    expect(row.usableForChannelAttribution).toBe(false);
    expect(row.blockingIssues).toContain("missing_revenue_value");
  });

  it("ignores non-revenue pipeline records", () => {
    const open = buildRevenueGraphRecord({ ...base, dealId: "deal-r3", dealStage: "proposal", dealClosedAt: null });
    expect(reconcileRevenueGraph([open])).toEqual([]);
  });
});