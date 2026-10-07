export type RevenueDriverEvidence = {
  averageWonValue: number;
  leadToQualifiedRate: number;
  qualifiedToWonRate: number;
  activitiesPerLead: number;
};

export type RevenueDriverPlan = {
  remainingRevenue: number;
  averageWonValue: number;
  wonOutcomesNeeded: number;
  qualifiedOpportunitiesNeeded: number;
  leadsNeeded: number;
  activitiesNeeded: number;
  evidence: RevenueDriverEvidence;
  mode: "scenario";
};

function positiveFinite(value: number, field: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be a positive finite number`);
  }
  return value;
}

function rate(value: number, field: string): number {
  if (!Number.isFinite(value) || value <= 0 || value > 1) {
    throw new Error(`${field} must be > 0 and <= 1`);
  }
  return value;
}

/**
 * Deterministic planning model only.
 *
 * This does not claim that the calculated volumes will cause the target to be
 * reached. It converts an explicit revenue gap and observed/planning evidence
 * into the minimum whole-number volumes implied by that scenario.
 */
export function decomposeRevenueGap(
  remainingRevenue: number,
  evidence: RevenueDriverEvidence,
): RevenueDriverPlan {
  if (!Number.isFinite(remainingRevenue) || remainingRevenue < 0) {
    throw new Error("remainingRevenue must be a non-negative finite number");
  }

  const averageWonValue = positiveFinite(evidence.averageWonValue, "averageWonValue");
  const leadToQualifiedRate = rate(evidence.leadToQualifiedRate, "leadToQualifiedRate");
  const qualifiedToWonRate = rate(evidence.qualifiedToWonRate, "qualifiedToWonRate");
  const activitiesPerLead = positiveFinite(evidence.activitiesPerLead, "activitiesPerLead");

  if (remainingRevenue === 0) {
    return {
      remainingRevenue,
      averageWonValue,
      wonOutcomesNeeded: 0,
      qualifiedOpportunitiesNeeded: 0,
      leadsNeeded: 0,
      activitiesNeeded: 0,
      evidence: {
        averageWonValue,
        leadToQualifiedRate,
        qualifiedToWonRate,
        activitiesPerLead,
      },
      mode: "scenario",
    };
  }

  const wonOutcomesNeeded = Math.ceil(remainingRevenue / averageWonValue);
  const qualifiedOpportunitiesNeeded = Math.ceil(wonOutcomesNeeded / qualifiedToWonRate);
  const leadsNeeded = Math.ceil(qualifiedOpportunitiesNeeded / leadToQualifiedRate);
  const activitiesNeeded = Math.ceil(leadsNeeded * activitiesPerLead);

  return {
    remainingRevenue,
    averageWonValue,
    wonOutcomesNeeded,
    qualifiedOpportunitiesNeeded,
    leadsNeeded,
    activitiesNeeded,
    evidence: {
      averageWonValue,
      leadToQualifiedRate,
      qualifiedToWonRate,
      activitiesPerLead,
    },
    mode: "scenario",
  };
}

export type DriverCapacity = {
  availableWonOutcomes?: number | null;
  availableQualifiedOpportunities?: number | null;
  availableLeads?: number | null;
  plannedActivities?: number | null;
};

export type DriverBottleneck =
  | "won_outcomes"
  | "qualified_opportunities"
  | "leads"
  | "activities";

export type DriverCapacityAssessment = {
  bottlenecks: Array<{
    driver: DriverBottleneck;
    required: number;
    available: number;
    deficit: number;
  }>;
  hasKnownCapacityGap: boolean;
};

function addGap(
  rows: DriverCapacityAssessment["bottlenecks"],
  driver: DriverBottleneck,
  required: number,
  available: number | null | undefined,
) {
  if (available == null) return;
  if (!Number.isFinite(available) || available < 0) {
    throw new Error(`${driver} capacity must be a non-negative finite number`);
  }
  if (available < required) {
    rows.push({ driver, required, available, deficit: required - available });
  }
}

export function assessDriverCapacity(
  plan: RevenueDriverPlan,
  capacity: DriverCapacity,
): DriverCapacityAssessment {
  const bottlenecks: DriverCapacityAssessment["bottlenecks"] = [];

  addGap(bottlenecks, "won_outcomes", plan.wonOutcomesNeeded, capacity.availableWonOutcomes);
  addGap(
    bottlenecks,
    "qualified_opportunities",
    plan.qualifiedOpportunitiesNeeded,
    capacity.availableQualifiedOpportunities,
  );
  addGap(bottlenecks, "leads", plan.leadsNeeded, capacity.availableLeads);
  addGap(bottlenecks, "activities", plan.activitiesNeeded, capacity.plannedActivities);

  return {
    bottlenecks: bottlenecks.sort((a, b) => b.deficit / Math.max(1, b.required) - a.deficit / Math.max(1, a.required)),
    hasKnownCapacityGap: bottlenecks.length > 0,
  };
}
