import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assumptions, modelUnitEconomics } from "./unit-economics.mjs";
describe("SatışDesk research pricing model", () => {
  it("reconciles weighted ARPA, service cost and direct margin", () => {
    const r = modelUnitEconomics(assumptions, 100);
    assert.equal(r.arpaTry, 4690);
    assert.equal(r.serviceCostPerTenantTry, 1485);
    assert.equal(r.mrrTry, 469000);
    assert.equal(r.variableCostTry, 148500);
    assert.equal(r.contributionTry, 320500);
    assert.ok(Math.abs(r.directGrossMargin - 320500 / 469000) < 1e-12);
  });
  it("does not mistake fixed or acquisition spend for gross margin", () => {
    const r = modelUnitEconomics(assumptions, 100, {monthlyFixedCostTry:75000, acquisitionSpendTry:25000, monthlyChurnRate:0.03});
    assert.equal(r.netOperatingBeforeTaxTry, 220500);
    assert.equal(r.operatingBreakEvenCompanies, 32);
    assert.equal(r.expectedMonthlyChurnedCompanies, 3);
  });
  it("handles zero tenants without dividing by zero", () => {
    assert.equal(modelUnitEconomics(assumptions,0).directGrossMargin,null);
  });
  it("rejects malformed share and cost inputs", () => {
    assert.throws(() => modelUnitEconomics([{plan:"bad",share:0.2,priceTry:1,directCostTry:0}],10));
    assert.throws(() => modelUnitEconomics(assumptions,-1));
    assert.throws(() => modelUnitEconomics(assumptions,10,{monthlyChurnRate:1.5}));
  });
});
