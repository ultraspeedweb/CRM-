import { describe, expect, it } from "vitest";
import { assessDriverCapacity, decomposeRevenueGap } from "./goal-driver-decomposition";

describe("Revenue goal driver decomposition", () => {
  it("turns a revenue gap into a whole-number execution scenario", () => {
    const plan = decomposeRevenueGap(220_000, {
      averageWonValue: 50_000,
      qualifiedToWonRate: 0.25,
      leadToQualifiedRate: 0.4,
      activitiesPerLead: 2,
    });

    expect(plan).toMatchObject({
      remainingRevenue: 220_000,
      wonOutcomesNeeded: 5,
      qualifiedOpportunitiesNeeded: 20,
      leadsNeeded: 50,
      activitiesNeeded: 100,
      mode: "scenario",
    });
  });

  it("rounds upward so the plan never understates required whole outcomes", () => {
    const plan = decomposeRevenueGap(100_001, {
      averageWonValue: 50_000,
      qualifiedToWonRate: 0.5,
      leadToQualifiedRate: 0.5,
      activitiesPerLead: 1.5,
    });

    expect(plan.wonOutcomesNeeded).toBe(3);
    expect(plan.qualifiedOpportunitiesNeeded).toBe(6);
    expect(plan.leadsNeeded).toBe(12);
    expect(plan.activitiesNeeded).toBe(18);
  });

  it("returns zero work for a closed gap", () => {
    const plan = decomposeRevenueGap(0, {
      averageWonValue: 50_000,
      qualifiedToWonRate: 0.25,
      leadToQualifiedRate: 0.4,
      activitiesPerLead: 2,
    });

    expect(plan.wonOutcomesNeeded).toBe(0);
    expect(plan.activitiesNeeded).toBe(0);
  });

  it("fails closed instead of inventing missing/invalid conversion evidence", () => {
    expect(() =>
      decomposeRevenueGap(100_000, {
        averageWonValue: 0,
        qualifiedToWonRate: 0.25,
        leadToQualifiedRate: 0.4,
        activitiesPerLead: 2,
      }),
    ).toThrow("averageWonValue must be a positive finite number");

    expect(() =>
      decomposeRevenueGap(100_000, {
        averageWonValue: 50_000,
        qualifiedToWonRate: 1.2,
        leadToQualifiedRate: 0.4,
        activitiesPerLead: 2,
      }),
    ).toThrow("qualifiedToWonRate must be > 0 and <= 1");
  });
});

describe("Driver capacity assessment", () => {
  it("identifies known execution bottlenecks without treating unknown capacity as zero", () => {
    const plan = decomposeRevenueGap(220_000, {
      averageWonValue: 50_000,
      qualifiedToWonRate: 0.25,
      leadToQualifiedRate: 0.4,
      activitiesPerLead: 2,
    });

    const result = assessDriverCapacity(plan, {
      availableQualifiedOpportunities: 12,
      availableLeads: 60,
      plannedActivities: 70,
    });

    expect(result.hasKnownCapacityGap).toBe(true);
    expect(result.bottlenecks).toEqual(
      expect.arrayContaining([
        { driver: "qualified_opportunities", required: 20, available: 12, deficit: 8 },
        { driver: "activities", required: 100, available: 70, deficit: 30 },
      ]),
    );
    expect(result.bottlenecks).not.toContainEqual(expect.objectContaining({ driver: "won_outcomes" }));
  });
});
