import { effectiveDays, getCyclePosition, daysBetween, TRAIN_WEEKS, CYCLE_WEEKS } from "./program";

// Plan: 6 progression weeks + 1 deload + 6 progression weeks = 13 weeks.
// Goal: 4 sessions x 12 progression weeks = 48 sessions. Deload-week sessions
// are tracked in the week strip but don't count toward the 48.
export const GOAL_TARGET = 48;
export const SESSIONS_PER_WEEK = 4;
export const PLAN_WEEKS = 13;
export const PLAN_DAYS = PLAN_WEEKS * 7;

function addDaysISO(iso, n) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Last day of the plan, pushed back by any declared breaks (they don't count).
export function planEndDate(startDate, pausedRanges) {
  if (!startDate) return null;
  let end = addDaysISO(startDate, PLAN_DAYS - 1);
  for (let i = 0; i < 5; i++) {
    let paused = 0;
    for (const r of pausedRanges || []) {
      const s = r.start > startDate ? r.start : startDate;
      const e = r.end < end ? r.end : end;
      if (e > s) paused += daysBetween(s, e);
    }
    const next = addDaysISO(startDate, PLAN_DAYS - 1 + paused);
    if (next === end) break;
    end = next;
  }
  return end;
}

// Pill i (0-based week of the plan): "1".."6", "D" (deload), "7".."12".
export function weekMeta(i) {
  const deload = i % CYCLE_WEEKS === TRAIN_WEEKS;
  const trainingNumber = i - Math.floor(i / CYCLE_WEEKS) + 1;
  return { deload, label: deload ? "D" : String(trainingNumber), title: deload ? "Deload week" : `Week ${trainingNumber}` };
}

// A "completed session" = a calendar date on which 6 or more distinct
// exercises were logged or skipped (every program day has exactly 6
// exercises). Dates before the cycle start belong to an earlier plan.
export function getCompletedSessionDates(history, startDate) {
  const exercisesByDate = {};
  for (const [exId, sessions] of Object.entries(history)) {
    for (const s of sessions) {
      if (startDate && s.date < startDate) continue;
      (exercisesByDate[s.date] ??= new Set()).add(exId);
    }
  }
  return Object.entries(exercisesByDate)
    .filter(([, ids]) => ids.size >= 6)
    .map(([date]) => date);
}

// Sessions that count toward the 48 (deload-week sessions excluded).
export function countCompletedSessions(history, startDate, pausedRanges) {
  return getCompletedSessionDates(history, startDate).filter(
    (date) => !startDate || !getCyclePosition(startDate, pausedRanges, date).isDeload
  ).length;
}

// Completed sessions per plan week (pauses don't advance the week).
export function getWeekCounts(startDate, pausedRanges, history) {
  const counts = Array(PLAN_WEEKS).fill(0);
  if (!startDate) return counts;
  for (const date of getCompletedSessionDates(history, startDate)) {
    const week = Math.floor(effectiveDays(startDate, pausedRanges, date) / 7);
    if (week >= 0 && week < PLAN_WEEKS) counts[week]++;
  }
  return counts;
}

export function getCurrentWeekIndex(startDate, pausedRanges) {
  if (!startDate) return 0;
  return Math.min(PLAN_WEEKS - 1, Math.floor(effectiveDays(startDate, pausedRanges) / 7));
}
