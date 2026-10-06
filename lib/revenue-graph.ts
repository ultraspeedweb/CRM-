export type RevenueGraphIssueCode =
  | "missing_responsible_actor"
  | "missing_source_attribution"
  | "missing_revenue_value"
  | "won_without_closed_at"
  | "accepted_quote_currency_mismatch"
  | "accepted_quote_value_mismatch"
  | "missing_branch_dimension";

export type RevenueGraphIssue = {
  code: RevenueGraphIssueCode;
  severity: "blocking" | "warning";
};

export type RevenueGraphInput = {
  organizationId: string;
  dealId: string;
  leadId: string;
  branchId?: string | null;
  sourceId?: string | null;
  sourceChannel?: string | null;
  campaignName?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  ownerUserId?: string | null;
  dealStage: string;
  dealAmount?: number | null;
  dealCurrency: string;
  dealClosedAt?: string | null;
  acceptedQuoteId?: string | null;
  acceptedQuoteTotal?: number | null;
  acceptedQuoteCurrency?: string | null;
  acceptedQuoteAcceptedAt?: string | null;
};

export type RevenueGraphRecord = RevenueGraphInput & {
  revenueOutcome: boolean;
  revenueValue: number | null;
  revenueCurrency: string;
  dataQualityIssues: RevenueGraphIssue[];
  productAttribution: "not_yet_available";
  goalContribution: "not_yet_available";
};

const MATERIAL_MISMATCH_PERCENT = 0.005;
const MATERIAL_MISMATCH_ABSOLUTE = 1;

export function materialValueMismatch(dealAmount: number, quoteTotal: number): boolean {
  const threshold = Math.max(MATERIAL_MISMATCH_ABSOLUTE, Math.abs(dealAmount) * MATERIAL_MISMATCH_PERCENT);
  return Math.abs(dealAmount - quoteTotal) > threshold;
}

export function buildRevenueGraphRecord(input: RevenueGraphInput): RevenueGraphRecord {
  const revenueOutcome = input.dealStage === "won";
  const issues: RevenueGraphIssue[] = [];

  if (!input.branchId) issues.push({ code: "missing_branch_dimension", severity: "warning" });

  if (revenueOutcome) {
    if (!input.ownerUserId) issues.push({ code: "missing_responsible_actor", severity: "warning" });
    if (!input.sourceId && !input.sourceChannel) issues.push({ code: "missing_source_attribution", severity: "warning" });
    if (input.dealAmount == null) issues.push({ code: "missing_revenue_value", severity: "blocking" });
    if (!input.dealClosedAt) issues.push({ code: "won_without_closed_at", severity: "blocking" });

    if (input.acceptedQuoteId && input.acceptedQuoteTotal != null && input.dealAmount != null) {
      if (input.acceptedQuoteCurrency && input.acceptedQuoteCurrency !== input.dealCurrency) {
        issues.push({ code: "accepted_quote_currency_mismatch", severity: "warning" });
      } else if (materialValueMismatch(input.dealAmount, input.acceptedQuoteTotal)) {
        issues.push({ code: "accepted_quote_value_mismatch", severity: "warning" });
      }
    }
  }

  return {
    ...input,
    revenueOutcome,
    revenueValue: revenueOutcome ? input.dealAmount ?? null : null,
    revenueCurrency: input.dealCurrency,
    dataQualityIssues: issues,
    productAttribution: "not_yet_available",
    goalContribution: "not_yet_available",
  };
}

export function hasBlockingRevenueGraphIssue(record: RevenueGraphRecord): boolean {
  return record.dataQualityIssues.some((issue) => issue.severity === "blocking");
}

export function canAttributeRevenueToEmployee(record: RevenueGraphRecord): boolean {
  return record.revenueOutcome && record.revenueValue != null && !!record.ownerUserId && !hasBlockingRevenueGraphIssue(record);
}

export function canAttributeRevenueToChannel(record: RevenueGraphRecord): boolean {
  return record.revenueOutcome && record.revenueValue != null && !!(record.sourceId || record.sourceChannel) && !hasBlockingRevenueGraphIssue(record);
}
export type RevenueGraphCurrencySummary = {
  currency: string;
  realizedRevenue: number;
  revenueOutcomeCount: number;
  employeeAttributedRevenue: number;
  channelAttributedRevenue: number;
};

export type RevenueGraphSummary = {
  byCurrency: RevenueGraphCurrencySummary[];
  qualityIssueCounts: Partial<Record<RevenueGraphIssueCode, number>>;
  recordCount: number;
  revenueOutcomeCount: number;
};

export function summarizeRevenueGraph(records: RevenueGraphRecord[]): RevenueGraphSummary {
  const currencyMap = new Map<string, RevenueGraphCurrencySummary>();
  const qualityIssueCounts: Partial<Record<RevenueGraphIssueCode, number>> = {};
  let revenueOutcomeCount = 0;

  for (const record of records) {
    for (const issue of record.dataQualityIssues) {
      qualityIssueCounts[issue.code] = (qualityIssueCounts[issue.code] ?? 0) + 1;
    }

    if (!record.revenueOutcome || record.revenueValue == null || hasBlockingRevenueGraphIssue(record)) continue;
    revenueOutcomeCount += 1;
    const summary = currencyMap.get(record.revenueCurrency) ?? {
      currency: record.revenueCurrency,
      realizedRevenue: 0,
      revenueOutcomeCount: 0,
      employeeAttributedRevenue: 0,
      channelAttributedRevenue: 0,
    };
    summary.realizedRevenue += record.revenueValue;
    summary.revenueOutcomeCount += 1;
    if (canAttributeRevenueToEmployee(record)) summary.employeeAttributedRevenue += record.revenueValue;
    if (canAttributeRevenueToChannel(record)) summary.channelAttributedRevenue += record.revenueValue;
    currencyMap.set(record.revenueCurrency, summary);
  }

  return {
    byCurrency: [...currencyMap.values()].sort((a, b) => a.currency.localeCompare(b.currency)),
    qualityIssueCounts,
    recordCount: records.length,
    revenueOutcomeCount,
  };
}
export type RevenueGraphReconciliationItem = {
  dealId: string;
  leadId: string;
  revenueCurrency: string;
  revenueValue: number | null;
  blockingIssues: RevenueGraphIssueCode[];
  warningIssues: RevenueGraphIssueCode[];
  usableForTotalRevenue: boolean;
  usableForEmployeeAttribution: boolean;
  usableForChannelAttribution: boolean;
};

export function reconcileRevenueGraph(records: RevenueGraphRecord[]): RevenueGraphReconciliationItem[] {
  return records
    .filter((record) => record.revenueOutcome)
    .map((record) => ({
      dealId: record.dealId,
      leadId: record.leadId,
      revenueCurrency: record.revenueCurrency,
      revenueValue: record.revenueValue,
      blockingIssues: record.dataQualityIssues.filter((issue) => issue.severity === "blocking").map((issue) => issue.code),
      warningIssues: record.dataQualityIssues.filter((issue) => issue.severity === "warning").map((issue) => issue.code),
      usableForTotalRevenue: record.revenueValue != null && !hasBlockingRevenueGraphIssue(record),
      usableForEmployeeAttribution: canAttributeRevenueToEmployee(record),
      usableForChannelAttribution: canAttributeRevenueToChannel(record),
    }));
}