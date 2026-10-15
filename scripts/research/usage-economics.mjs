// Research-only scenario engine; not a billing authority.
// Currency TRY. Rates are user-supplied hypotheses, NEVER claimed Meta/provider tariffs.
import { assumptions, modelUnitEconomics } from "./unit-economics.mjs";

function n(v, name) {
  if (!Number.isFinite(v) || v < 0) throw new RangeError(name + " must be nonnegative and finite");
  return v;
}
export function estimatePerTenantUsage(input) {
  const seats = n(input.seats ?? 0,"seats");
  const metaMessages = n(input.metaMessages ?? 0,"meta messages");
  const includedMessages = n(input.includedMessages ?? 0,"included messages");
  const metaUnitCostTry = n(input.metaUnitCostTry ?? 0,"meta unit cost");
  const aiCalls = n(input.aiCalls ?? 0,"AI calls");
  const includedAiCalls = n(input.includedAiCalls ?? 0,"included AI calls");
  const aiUnitCostTry = n(input.aiUnitCostTry ?? 0,"AI unit cost");
  const supportHours = n(input.supportHours ?? 0,"support hours");
  const supportHourlyTry = n(input.supportHourlyTry ?? 0,"support hourly rate");
  const hostingTry = n(input.hostingTry ?? 0,"hosting");
  const emailSmsTry = n(input.emailSmsTry ?? 0,"email/SMS");
  const serviceSeatCostTry = n(input.serviceSeatCostTry ?? 0,"seat cost");
  const companyPriceTry = n(input.companyPriceTry ?? 0,"company plan price");
  const messageOveragePriceTry = n(input.messageOveragePriceTry ?? 0,"message overage charge");
  const aiOveragePriceTry = n(input.aiOveragePriceTry ?? 0,"AI overage charge");
  if (![seats,metaMessages,includedMessages,metaUnitCostTry,aiCalls,includedAiCalls,aiUnitCostTry,supportHours,supportHourlyTry,hostingTry,emailSmsTry,serviceSeatCostTry,companyPriceTry,messageOveragePriceTry,aiOveragePriceTry].every(Number.isFinite)) throw Error("Invalid amount");
  // Variable provider cost includes the entire usage, not just overage.
  const metaCostTry = metaMessages * metaUnitCostTry;
  const aiCostTry = aiCalls * aiUnitCostTry;
  const supportCostTry = supportHours * supportHourlyTry;
  const totalDirectCostTry = metaCostTry + aiCostTry + supportCostTry + hostingTry + emailSmsTry + seats * serviceSeatCostTry;
  const billableExtraMessages = Math.max(0,metaMessages-includedMessages);
  const billableExtraAiCalls = Math.max(0,aiCalls-includedAiCalls);
  const overageRevenueTry = billableExtraMessages*messageOveragePriceTry + billableExtraAiCalls*aiOveragePriceTry;
  const totalRevenueTry = companyPriceTry+overageRevenueTry;
  const contributionTry = totalRevenueTry-totalDirectCostTry;
  return {
    metaCostTry, aiCostTry, supportCostTry, hostingTry, emailSmsTry,
    totalDirectCostTry, billableExtraMessages, billableExtraAiCalls,
    overageRevenueTry, totalRevenueTry, contributionTry,
    grossMargin: totalRevenueTry === 0 ? null : contributionTry / totalRevenueTry,
    belowZeroContribution: contributionTry < 0
  };
}
export function computeWeightedScenarios(usageCases, tenantCount) {
  if (!Array.isArray(usageCases) || usageCases.length === 0) throw new RangeError("Missing usage cases");
  const totalShare=usageCases.reduce((s,x)=>s+n(x.share,"share"),0);
  if(Math.abs(totalShare-1)>1e-9) throw new RangeError("Shares must sum to 1");
  if(!Number.isSafeInteger(tenantCount)||tenantCount<0) throw new RangeError("Invalid tenant count");
  const perTenant = usageCases.reduce((result,caseItem)=>{
    const item=estimatePerTenantUsage(caseItem);
    result.revenueTry+=caseItem.share*item.totalRevenueTry;
    result.directCostTry+=caseItem.share*item.totalDirectCostTry;
    result.redFlagShare+=caseItem.share*Number(item.belowZeroContribution);
    return result;
  },{revenueTry:0,directCostTry:0,redFlagShare:0});
  return {
    ...perTenant,
    companies:tenantCount,
    totalRevenueTry:perTenant.revenueTry*tenantCount,
    totalDirectCostTry:perTenant.directCostTry*tenantCount,
    totalContributionTry:(perTenant.revenueTry-perTenant.directCostTry)*tenantCount
  };
}
export const illustrativeUsageCases = [
  {share:0.5,companyPriceTry:1990,seats:2,serviceSeatCostTry:45,metaMessages:300,includedMessages:250,metaUnitCostTry:0.50,messageOveragePriceTry:0.75,aiCalls:200,includedAiCalls:150,aiUnitCostTry:0.25,aiOveragePriceTry:0.40,supportHours:1,supportHourlyTry:200,hostingTry:150,emailSmsTry:35},
  {share:0.35,companyPriceTry:4990,seats:5,serviceSeatCostTry:45,metaMessages:1300,includedMessages:1000,metaUnitCostTry:0.50,messageOveragePriceTry:0.75,aiCalls:900,includedAiCalls:700,aiUnitCostTry:0.25,aiOveragePriceTry:0.40,supportHours:2,supportHourlyTry:200,hostingTry:300,emailSmsTry:65},
  {share:0.15,companyPriceTry:12990,seats:12,serviceSeatCostTry:45,metaMessages:3500,includedMessages:3000,metaUnitCostTry:0.50,messageOveragePriceTry:0.75,aiCalls:3500,includedAiCalls:3000,aiUnitCostTry:0.25,aiOveragePriceTry:0.40,supportHours:4,supportHourlyTry:200,hostingTry:850,emailSmsTry:150},
];
// Unit economics from the separate base model is deliberately not added here;
// doing so would double-count costs already itemized above.
if(process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\","/"))) {
  for(const n of [10,100,1000]) console.log(JSON.stringify(computeWeightedScenarios(illustrativeUsageCases,n)));
}
