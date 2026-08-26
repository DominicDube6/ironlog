import { effectiveDays } from "./program";

// Training goal: 4 sessions/week x 12 weeks = 48 full sessions before the deadline.
export const GOAL_TARGET = 48;
export const GOAL_DEADLINE = "2026-11-25";
export const GOAL_WEEKS = 12;
export const SESSIONS_PER_WEEK = 4;

// A "completed session" = a calendar date on which 6 or more distinct
// exercises were logged or skipped (every program day has exactly 6
// exercises). Cheaper and more robust than matching against the exact
// rotated program that was live on that date.
export function getCompletedSessionDates(history) {
  const exercisesByDate = {};
  for (const [exId, sessions] of Object.entries(history)) {
    for (const s of sessions) {
      (exercisesByDate[s.date] ??= new Set()).add(exId);
    }
  }
  return Object.entries(exercisesByDate)
    .filter(([, ids]) => ids.size >= 6)
    .map(([date]) => date);
}

export function countCompletedSessions(history) {
  return getCompletedSessionDates(history).length;
}

// Buckets completed sessions into the 12 training weeks (pauses don't count,
// same effective-day math as the 4-week accessory rotation blocks).
export function getWeekCounts(startDate, pausedRanges, history) {
  const counts = Array(GOAL_WEEKS).fill(0);
  if (!startDate) return counts;
  for (const date of getCompletedSessionDates(history)) {
    const week = Math.floor(effectiveDays(startDate, pausedRanges, date) / 7);
    if (week >= 0 && week < GOAL_WEEKS) counts[week]++;
  }
  return counts;
}

export function getCurrentWeekIndex(startDate, pausedRanges) {
  if (!startDate) return 0;
  return Math.min(GOAL_WEEKS - 1, Math.floor(effectiveDays(startDate, pausedRanges) / 7));
}
