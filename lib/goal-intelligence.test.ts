import { describe, expect, it } from "vitest";
import { analyzeGoalTrajectory, deriveGoalActionSignals } from "./goal-intelligence";

const base = {
  goalId: "goal-1",
  metric: "revenue",
  baselineValue: 0,
  targetValue: 1_000_000,
  currentValue: 420_000,
  startAt: "2026-10-01T00:00:00.000Z",
  endAt: "2026-10-31T00:00:00.000Z",
  asOf: "2026-10-16T00:00:00.000Z",
  currency: "TRY",
};

describe("Goal Intelligence trajectory", () => {
  it("calculates pace, remaining gap and run-rate requirements deterministically", () => {
    const result = analyzeGoalTrajectory(base);
    expect(result.progressRatio).toBeCloseTo(0.42);
    expect(result.elapsedRatio).toBeCloseTo(0.5);
    expect(result.expectedValueByNow).toBeCloseTo(500_000);
    expect(result.paceGap).toBeCloseTo(-80_000);
    expect(result.remainingGap).toBe(580_000);
    expect(result.currentDailyRunRate).toBeCloseTo(28_000);
    expect(result.requiredDailyRunRate).toBeCloseTo(38_666.6667);
    expect(result.forecastEndValue).toBeCloseTo(840_000);
    expect(result.status).toBe("at_risk");
  });

  it("keeps baseline-aware targets from overstating progress", () => {
    const result = analyzeGoalTrajectory({
      ...base,
      baselineValue: 200_000,
      targetValue: 1_000_000,
      currentValue: 600_000,
    });
    expect(result.targetDelta).toBe(800_000);
    expect(result.achievedDelta).toBe(400_000);
    expect(result.progressRatio).toBeCloseTo(0.5);
    expect(result.status).toBe("on_track");
  });

  it("marks a goal complete immediately when the target is reached", () => {
    const result = analyzeGoalTrajectory({ ...base, currentValue: 1_050_000 });
    expect(result.status).toBe("complete");
    expect(result.remainingGap).toBe(0);
    expect(result.requiredDailyRunRate).toBe(0);
  });

  it("does not invent a run rate before the goal starts", () => {
    const result = analyzeGoalTrajectory({ ...base, asOf: "2026-09-25T00:00:00.000Z" });
    expect(result.status).toBe("not_started");
    expect(result.elapsedRatio).toBe(0);
    expect(result.currentDailyRunRate).toBeNull();
  });

  it("marks an unfinished goal expired after its deadline", () => {
    const result = analyzeGoalTrajectory({ ...base, asOf: "2026-11-02T00:00:00.000Z" });
    expect(result.status).toBe("expired");
    expect(result.remainingDays).toBe(0);
    expect(result.requiredDailyRunRate).toBeNull();
  });

  it("fails closed on invalid goal contracts", () => {
    expect(() => analyzeGoalTrajectory({ ...base, targetValue: 0 })).toThrow(
      "targetValue must be greater than baselineValue",
    );
    expect(() =>
      analyzeGoalTrajectory({ ...base, endAt: "2026-09-01T00:00:00.000Z" }),
    ).toThrow("endAt must be after startAt");
    expect(() => analyzeGoalTrajectory({ ...base, currentValue: Number.NaN })).toThrow(
      "currentValue must be finite",
    );
  });
});

describe("Goal action signals", () => {
  it("turns a pace deficit into explicit execution signals", () => {
    const signals = deriveGoalActionSignals(analyzeGoalTrajectory(base));
    expect(signals).toEqual([
      expect.objectContaining({ kind: "increase_run_rate", priority: 3 }),
      expect.objectContaining({ kind: "close_pace_gap", priority: 2, valueGap: 80_000 }),
    ]);
  });

  it("does not manufacture actions before the goal begins", () => {
    const signals = deriveGoalActionSignals(
      analyzeGoalTrajectory({ ...base, asOf: "2026-09-25T00:00:00.000Z" }),
    );
    expect(signals).toEqual([]);
  });

  it("emits a terminal completion signal for a reached goal", () => {
    const signals = deriveGoalActionSignals(
      analyzeGoalTrajectory({ ...base, currentValue: 1_000_000 }),
    );
    expect(signals).toEqual([{ kind: "goal_complete", priority: 0 }]);
  });
});
