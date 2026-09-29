export function actionBucket(dueAt: string | null, now: Date) {
  if (!dueAt || !Number.isFinite(Date.parse(dueAt))) return "missing";
  const due = new Date(dueAt);
  if (due.getTime() < now.getTime()) return "overdue";
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", {timeZone:"Europe/Istanbul",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
  return day(due) === day(now) ? "today" : "next";
}
export function stageAgeDays(enteredAt: string, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - Date.parse(enteredAt)) / 86400000));
}
export function istanbulInput(date: string | null) {
  return date ? new Date(Date.parse(date) + 3 * 3600000).toISOString().slice(0,16) : "";
}
