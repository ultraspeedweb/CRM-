// Research-only pricing model. NEVER use as a billing authority.
// Run: node --test scripts/research/unit-economics.test.mjs
// Run: node scripts/research/unit-economics.mjs
export const assumptions = Object.freeze([
  { plan: "Starter", share: 0.5, priceTry: 1990, directCostTry: 650 },
  { plan: "Growth", share: 0.35, priceTry: 4990, directCostTry: 1600 },
  { plan: "Business", share: 0.15, priceTry: 12990, directCostTry: 4000 },
]);

function numeric(value, label) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(label + " must be finite and nonnegative");
  return value;
}
export function modelUnitEconomics(plans, payingCompanies, options = {}) {
  if (!Array.isArray(plans) || plans.length === 0) throw new RangeError("Missing plans");
  if (!Number.isSafeInteger(payingCompanies) || payingCompanies < 0) throw new RangeError("Invalid paying-company count");
  const shares = plans.reduce((sum, plan) => sum + numeric(plan.share, "share"), 0);
  if (Math.abs(shares - 1) > 1e-9) throw new RangeError("Plan shares must total 100%");
  const monthlyFixedCostTry = numeric(options.monthlyFixedCostTry ?? 0, "fixed costs");
  const acquisitionSpendTry = numeric(options.acquisitionSpendTry ?? 0, "acquisition spend");
  const churnRate = numeric(options.monthlyChurnRate ?? 0, "monthly churn rate");
  if (churnRate > 1) throw new RangeError("Monthly churn rate must not exceed 100%");
  const arpaTry = plans.reduce((sum, plan) => sum + numeric(plan.share,"share") * numeric(plan.priceTry,"price"), 0);
  const serviceCostPerTenantTry = plans.reduce((sum, plan) => sum + plan.share * numeric(plan.directCostTry,"direct cost"), 0);
  const mrrTry = arpaTry * payingCompanies;
  const variableCostTry = serviceCostPerTenantTry * payingCompanies;
  const contributionTry = mrrTry - variableCostTry;
  const netOperatingBeforeTaxTry = contributionTry - monthlyFixedCostTry - acquisitionSpendTry;
  return {
    payingCompanies, arpaTry, serviceCostPerTenantTry, mrrTry, variableCostTry,
    contributionTry, directGrossMargin: mrrTry === 0 ? null : contributionTry / mrrTry,
    monthlyFixedCostTry, acquisitionSpendTry, netOperatingBeforeTaxTry,
    expectedMonthlyChurnedCompanies: payingCompanies * churnRate,
    // Illustrative static break-even only. Omits ramp, taxes and sales cycle.
    operatingBreakEvenCompanies: arpaTry > serviceCostPerTenantTry
      ? Math.ceil((monthlyFixedCostTry + acquisitionSpendTry) / (arpaTry - serviceCostPerTenantTry))
      : null
  };
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\","/"))) {
  for (const companies of [10, 100, 1000]) {
    console.log(JSON.stringify(modelUnitEconomics(assumptions, companies, {
      monthlyFixedCostTry: 75000, acquisitionSpendTry: 25000, monthlyChurnRate: 0.03
    })));
  }
}
