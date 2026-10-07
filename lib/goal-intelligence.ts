export type GoalTrajectoryStatus =
  | "not_started"
  | "ahead"
  | "on_track"
  | "at_risk"
  | "complete"
  | "expired";

export type GoalTrajectoryInput = {
  goalId: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  baselineValue?: number;
  startAt: string;
  endAt: string;
  asOf: string;
  currency?: string | null;
};

export type GoalTrajectory = {
  goalId: string;
  metric: string;
  currency: string | null;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  targetDelta: number;
  achievedDelta: number;
  progressRatio: number;
  elapsedRatio: number;
  expectedValueByNow: number;
  paceGap: number;
  remainingGap: number;
  elapsedDays: number;
  remainingDays: number;
  currentDailyRunRate: number | null;
  requiredDailyRunRate: number | null;
  forecastEndValue: number | null;
  status: GoalTrajectoryStatus;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const ON_TRACK_TOLERANCE = 0.02;

function parseTimestamp(value: string, field: string): number {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid ${field}`);
  return parsed;
}

function finiteNumber(value: number, field: string): number {
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite`);
  return value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function analyzeGoalTrajectory(input: GoalTrajectoryInput): GoalTrajectory {
  const baselineValue = finiteNumber(input.baselineValue ?? 0, "baselineValue");
  const targetValue = finiteNumber(input.targetValue, "targetValue");
  const currentValue = finiteNumber(input.currentValue, "currentValue");

  if (targetValue <= baselineValue) {
    throw new Error("targetValue must be greater than baselineValue");
  }

  const startMs = parseTimestamp(input.startAt, "startAt");
  const endMs = parseTimestamp(input.endAt, "endAt");
  const asOfMs = parseTimestamp(input.asOf, "asOf");

  if (endMs <= startMs) throw new Error("endAt must be after startAt");

  const targetDelta = targetValue - baselineValue;
  const achievedDelta = Math.max(0, currentValue - baselineValue);
  const progressRatio = clamp(achievedDelta / targetDelta, 0, 1);

  const totalMs = endMs - startMs;
  const elapsedMs = clamp(asOfMs - startMs, 0, totalMs);
  const elapsedRatio = elapsedMs / totalMs;

  const elapsedDays = elapsedMs / DAY_MS;
  const remainingDays = Math.max(0, (endMs - Math.max(asOfMs, startMs)) / DAY_MS);
  const expectedValueByNow = baselineValue + targetDelta * elapsedRatio;
  const paceGap = currentValue - expectedValueByNow;
  const remainingGap = Math.max(0, targetValue - currentValue);

  const currentDailyRunRate =
    asOfMs <= startMs || elapsedDays <= 0
      ? null
      : Math.max(0, currentValue - baselineValue) / elapsedDays;

  const requiredDailyRunRate =
    remainingGap === 0
      ? 0
      : remainingDays > 0
        ? remainingGap / remainingDays
        : null;

  const forecastEndValue =
    remainingGap === 0
      ? currentValue
      : currentDailyRunRate == null
        ? null
        : currentValue + currentDailyRunRate * remainingDays;

  let status: GoalTrajectoryStatus;
  if (currentValue >= targetValue) {
    status = "complete";
  } else if (asOfMs < startMs) {
    status = "not_started";
  } else if (asOfMs >= endMs) {
    status = "expired";
  } else if (progressRatio > elapsedRatio + ON_TRACK_TOLERANCE) {
    status = "ahead";
  } else if (progressRatio >= Math.max(0, elapsedRatio - ON_TRACK_TOLERANCE)) {
    status = "on_track";
  } else {
    status = "at_risk";
  }

  return {
    goalId: input.goalId,
    metric: input.metric,
    currency: input.currency ?? null,
    baselineValue,
    targetValue,
    currentValue,
    targetDelta,
    achievedDelta,
    progressRatio,
    elapsedRatio,
    expectedValueByNow,
    paceGap,
    remainingGap,
    elapsedDays,
    remainingDays,
    currentDailyRunRate,
    requiredDailyRunRate,
    forecastEndValue,
    status,
  };
}

export type GoalActionSignal =
  | { kind: "goal_complete"; priority: 0 }
  | { kind: "preserve_pace"; priority: 1 }
  | { kind: "close_pace_gap"; priority: 2; valueGap: number }
  | { kind: "increase_run_rate"; priority: 3; requiredDailyRunRate: number; currentDailyRunRate: number | null }
  | { kind: "goal_expired"; priority: 4; remainingGap: number };

export function deriveGoalActionSignals(trajectory: GoalTrajectory): GoalActionSignal[] {
  if (trajectory.status === "complete") return [{ kind: "goal_complete", priority: 0 }];
  if (trajectory.status === "expired") {
    return [{ kind: "goal_expired", priority: 4, remainingGap: trajectory.remainingGap }];
  }
  if (trajectory.status === "not_started") return [];

  const signals: GoalActionSignal[] = [];
  if (trajectory.status === "ahead" || trajectory.status === "on_track") {
    signals.push({ kind: "preserve_pace", priority: 1 });
  }
  if (trajectory.paceGap < 0) {
    signals.push({ kind: "close_pace_gap", priority: 2, valueGap: Math.abs(trajectory.paceGap) });
  }
  if (
    trajectory.requiredDailyRunRate != null &&
    (trajectory.currentDailyRunRate == null ||
      trajectory.requiredDailyRunRate > trajectory.currentDailyRunRate)
  ) {
    signals.push({
      kind: "increase_run_rate",
      priority: 3,
      requiredDailyRunRate: trajectory.requiredDailyRunRate,
      currentDailyRunRate: trajectory.currentDailyRunRate,
    });
  }

  return signals.sort((a, b) => b.priority - a.priority);
}
