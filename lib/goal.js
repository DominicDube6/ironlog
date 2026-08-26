// Training goal: 4 sessions/week x 12 weeks = 48 full sessions before the deadline.
export const GOAL_TARGET = 48;
export const GOAL_DEADLINE = "2026-11-25";

// A "completed session" = a calendar date on which 6 or more distinct
// exercises were logged (every program day has exactly 6 exercises).
// Cheaper and more robust than matching against the exact rotated program
// that was live on that date.
export function countCompletedSessions(history) {
  const exercisesByDate = {};
  for (const [exId, sessions] of Object.entries(history)) {
    for (const s of sessions) {
      (exercisesByDate[s.date] ??= new Set()).add(exId);
    }
  }
  return Object.values(exercisesByDate).filter((set) => set.size >= 6).length;
}
