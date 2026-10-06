import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("WS-B Revenue Graph query security contract", () => {
  it("keeps every source query explicitly tenant-scoped and fail-closed", () => {
    const source = fs.readFileSync("lib/revenue-graph-query.ts", "utf8");
    const orgScopes = source.match(/\.eq\("organization_id", organizationId\)/g) ?? [];
    expect(orgScopes.length).toBeGreaterThanOrEqual(4);
    expect(source).toContain("Revenue Graph deals lookup failed");
    expect(source).toContain("Revenue Graph leads lookup failed");
    expect(source).toContain("Revenue Graph quote lookup failed");
    expect(source).toContain("Revenue Graph source lookup failed");
    expect(source).not.toContain("service_role");
    expect(source).not.toContain("serviceRole");
  });

  it("keeps quote evidence subordinate to the deal revenue contract", () => {
    const source = fs.readFileSync("lib/revenue-graph-query.ts", "utf8");
    expect(source).toContain("dealAmount: deal.amount");
    expect(source).toContain("acceptedQuoteTotal: quote?.total ?? null");
  });

  it("keeps unsupported downstream dimensions explicitly disabled", () => {
    const source = fs.readFileSync("lib/revenue-graph-query.ts", "utf8");
    expect(source).toContain("productAttribution: false");
    expect(source).toContain("marginAttribution: false");
    expect(source).toContain("goalContribution: false");
    expect(source).toContain("teamAttribution: false");
    expect(source).toContain("orderAttribution: false");
  });
});