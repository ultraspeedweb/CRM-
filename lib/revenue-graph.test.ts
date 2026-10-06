import { describe, expect, it } from "vitest";
import {
  buildRevenueGraphRecord,
  canAttributeRevenueToChannel,
  canAttributeRevenueToEmployee,
  hasBlockingRevenueGraphIssue,
  materialValueMismatch,
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