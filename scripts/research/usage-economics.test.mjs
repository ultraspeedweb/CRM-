import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {estimatePerTenantUsage,computeWeightedScenarios,illustrativeUsageCases} from "./usage-economics.mjs";

describe("usage and overage research",()=>{
  it("charges provider costs on all messages, not only billable excess",()=>{
    const r=estimatePerTenantUsage({companyPriceTry:1000,metaMessages:100,includedMessages:80,metaUnitCostTry:2,messageOveragePriceTry:3,aiCalls:10,includedAiCalls:10,aiUnitCostTry:5});
    assert.equal(r.metaCostTry,200);
    assert.equal(r.aiCostTry,50);
    assert.equal(r.billableExtraMessages,20);
    assert.equal(r.overageRevenueTry,60);
    assert.equal(r.totalRevenueTry,1060);
    assert.equal(r.totalDirectCostTry,250);
  });
  it("can flag unprofitable high usage",()=>{
    const r=estimatePerTenantUsage({companyPriceTry:100,metaMessages:1000,metaUnitCostTry:1,includedMessages:1000});
    assert.equal(r.belowZeroContribution,true);
    assert.equal(r.contributionTry,-900);
  });
  it("refuses invalid, negative and inconsistent inputs",()=>{
    assert.throws(()=>estimatePerTenantUsage({metaUnitCostTry:-1}));
    assert.throws(()=>estimatePerTenantUsage({aiCalls:Infinity}));
    assert.throws(()=>computeWeightedScenarios([{share:0.6}],10));
    assert.throws(()=>computeWeightedScenarios(illustrativeUsageCases,0.5));
  });
  it("reconciles 10, 100 and 1000 company scenarios",()=>{
    const a=computeWeightedScenarios(illustrativeUsageCases,10);
    const b=computeWeightedScenarios(illustrativeUsageCases,100);
    const c=computeWeightedScenarios(illustrativeUsageCases,1000);
    assert.ok(Math.abs(10*a.totalRevenueTry-b.totalRevenueTry)<1e-8);
    assert.ok(Math.abs(10*b.totalDirectCostTry-c.totalDirectCostTry)<1e-7);
  });
});
