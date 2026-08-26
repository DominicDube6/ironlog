// Program definition: Full Body 4x/week, advanced lifter.
// Ported from the iron-log.jsx artifact — do not change exercise data
// without updating suggestNext/buildProgram callers accordingly.

export const PROGRAM = {
  A: {
    label: "Day A",
    exercises: [
      { id: "a1", name: "Back Squat", sets: 3, repMin: 6, repMax: 8, increment: 10, cat: "Lower Body", pattern: "squat", desc: "Bar on your upper back (not your neck). Descend by pushing your hips back, thighs parallel to the floor, drive back up through the floor." },
      { id: "a2", name: "Bench Press", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Push", pattern: "push", desc: "Lying on the bench, lower the bar to touch your chest, press up while keeping your shoulder blades pinned." },
      { id: "a3", name: "Barbell Row", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Bent over, back flat, pull the bar to your lower stomach while squeezing your shoulder blades together." },
      { id: "a4", name: "Overhead Press", sets: 3, repMin: 6, repMax: 8, increment: 5, cat: "Push", pattern: "push", desc: "Standing, bar at shoulder height, press straight overhead without arching your back." },
      { id: "a5", name: "Romanian Deadlift", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Lower Body", pattern: "hinge", desc: "Knees almost straight (slight bend), push your hips back keeping the bar close to your legs, feel the stretch in your hamstrings, drive back up by pushing your hips forward." },
      { id: "a6", name: "Face Pull", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "pull", desc: "On the high cable with a rope, pull toward your face while spreading your hands apart, elbows high. Target the rear delts." },
    ],
  },
  B: {
    label: "Day B",
    exercises: [
      { id: "b1", name: "Deadlift", sets: 3, repMin: 5, repMax: 6, increment: 10, cat: "Lower Body", pattern: "hinge", desc: "Bar on the floor against your shins, back flat, push the floor away with your feet and stand up by extending your hips and back together." },
      { id: "b2", name: "Incline Dumbbell Press", sets: 4, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Bench set to ~30°, one dumbbell in each hand, press up until the dumbbells almost touch." },
      { id: "b3", name: "Weighted Pull-ups", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Wide grip, palms facing away. Add weight at your belt. Pull until your chin clears the bar." },
      { id: "b4", name: "Dumbbell Shoulder Press", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Seated or standing, one dumbbell per shoulder, press straight overhead." },
      { id: "b5", name: "Bulgarian Split Squat", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Lower Body", pattern: "lunge", desc: "Rear foot elevated on a bench, lower the front leg to 90°, drive back up. Complete all reps on one leg before switching." },
      { id: "b6", name: "Barbell Curl", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "Standing, underhand grip, bend your elbows while keeping your arms pinned to your sides, curl the bar up toward your shoulders." },
    ],
  },
  C: {
    label: "Day C",
    exercises: [
      { id: "c1", name: "Front Squat", sets: 3, repMin: 6, repMax: 8, increment: 5, cat: "Lower Body", pattern: "squat", desc: "Bar racked across the front of your shoulders, elbows high. Descend straight down, torso more upright than a back squat." },
      { id: "c2", name: "Weighted Dips", sets: 4, repMin: 6, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "On the dip bars, add weight at your belt. Lower until your shoulders are below your elbows, press back up." },
      { id: "c3", name: "Pendlay Row", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Like a barbell row but the bar starts from the floor on every rep — torso nearly parallel to the floor, pull explosively toward your stomach." },
      { id: "c4", name: "Lateral Raise", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "One dumbbell in each hand, raise your arms out to the sides to shoulder height, slight bend in the elbows." },
      { id: "c5", name: "Cable Leg Curl (ankle strap)", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Lower Body", pattern: "isolation", desc: "Ankle strap on the low cable, standing facing the machine, bend your knee to bring your heel toward your glute." },
      { id: "c6", name: "Cable Triceps Pushdown", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "push", desc: "On the high cable, elbows pinned to your sides, push the bar/rope down to full extension of the arm." },
    ],
  },
  D: {
    label: "Day D",
    exercises: [
      { id: "d1", name: "Sumo Deadlift", sets: 3, repMin: 6, repMax: 8, increment: 10, cat: "Lower Body", pattern: "hinge", desc: "Feet very wide, toes pointed out, hands inside the legs. More upright torso than a conventional deadlift. Push the floor away to stand." },
      { id: "d2", name: "Flat Dumbbell Press", sets: 4, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Lying on a flat bench, one dumbbell per hand, lower to the sides of your chest, press back up." },
      { id: "d3", name: "Weighted Chin-ups", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Like pull-ups but palms facing you, narrower grip. Add weight at your belt." },
      { id: "d4", name: "Arnold Press", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Start with palms facing you in front of your shoulders, press up while rotating your palms forward." },
      { id: "d5", name: "Walking Lunges", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Lower Body", pattern: "lunge", desc: "Dumbbells in each hand, step forward into a lunge, back knee close to the floor, drive forward into the next lunge." },
      { id: "d6", name: "Hammer Curl", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "Like a barbell curl but with dumbbells, palms facing each other throughout the movement." },
    ],
  },
};

export const DAY_KEYS = ["A", "B", "C", "D"];

// Accessory slots rotate every 4 weeks to keep things fresh.
// Main compound lifts stay fixed so weight progression history stays continuous.
export const SLOT_VARIANTS = {
  a6: [
    { id: "a6-0", name: "Face Pull", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "pull", desc: "On the high cable with a rope, pull toward your face while spreading your hands apart, elbows high. Target the rear delts." },
    { id: "a6-1", name: "Single-Arm Dumbbell Row", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Accessory", pattern: "pull", desc: "One knee and hand on the bench, pull the dumbbell toward your hip keeping your elbow close to your body." },
  ],
  b6: [
    { id: "b6-0", name: "Barbell Curl", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "Standing, underhand grip, bend your elbows while keeping your arms pinned to your sides, curl the bar up toward your shoulders." },
    { id: "b6-1", name: "Incline Dumbbell Curl", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "Seated on an incline bench, arms hanging back, curl the dumbbells without swinging your shoulders." },
  ],
  c4: [
    { id: "c4-0", name: "Lateral Raise", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "One dumbbell in each hand, raise your arms out to the sides to shoulder height, slight bend in the elbows." },
    { id: "c4-1", name: "Dumbbell Y-Raise", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "Leaning over an incline bench, raise the dumbbells forming a Y overhead, thumbs pointing up." },
  ],
  c5: [
    { id: "c5-0", name: "Cable Leg Curl (ankle strap)", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Lower Body", pattern: "isolation", desc: "Ankle strap on the low cable, standing facing the machine, bend your knee to bring your heel toward your glute." },
    { id: "c5-1", name: "Barbell Good Morning", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Lower Body", pattern: "hinge", desc: "Bar on your upper back like a squat, hinge your torso forward keeping your back flat and legs nearly straight, feel the stretch in your hamstrings." },
  ],
  c6: [
    { id: "c6-0", name: "Cable Triceps Pushdown", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "push", desc: "On the high cable, elbows pinned to your sides, push the bar/rope down to full extension of the arm." },
    { id: "c6-1", name: "Two-Handed Overhead Triceps Extension", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessory", pattern: "push", desc: "One dumbbell held with both hands behind your head, elbows pointed at the ceiling, extend your arms upward." },
  ],
  d6: [
    { id: "d6-0", name: "Hammer Curl", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "Like a barbell curl but with dumbbells, palms facing each other throughout the movement." },
    { id: "d6-1", name: "Barbell 21s", sets: 3, repMin: 21, repMax: 21, increment: 2.5, cat: "Accessory", pattern: "isolation", desc: "7 reps from the bottom to halfway, 7 reps from halfway to the top, 7 reps full range — same weight for all 21." },
  ],
};

// Flat catalog of every distinct exercise in the app (the 18 fixed lifts plus
// the 12 accessory slot variants) — the pool "change exercise" picks from.
// Excludes the base a6/b6/c4/c5/c6/d6 entries in PROGRAM since those slots
// are always shown through their SLOT_VARIANTS instead.
export const EXERCISE_CATALOG = (() => {
  const map = {};
  for (const day of Object.values(PROGRAM)) {
    for (const ex of day.exercises) {
      if (!SLOT_VARIANTS[ex.id]) map[ex.id] = ex;
    }
  }
  for (const variants of Object.values(SLOT_VARIANTS)) {
    for (const ex of variants) map[ex.id] = ex;
  }
  return map;
})();

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function effectiveDays(startDate, pausedRanges, asOf = todayISO()) {
  let total = daysBetween(startDate, asOf);
  for (const r of pausedRanges || []) {
    const s = new Date(Math.max(new Date(startDate + "T00:00:00"), new Date(r.start + "T00:00:00")));
    const e = new Date(Math.min(new Date(asOf + "T00:00:00"), new Date(r.end + "T00:00:00")));
    if (e > s) total -= Math.round((e - s) / 86400000);
  }
  return Math.max(total, 0);
}

export function getBlockIndex(startDate, pausedRanges) {
  return Math.floor(effectiveDays(startDate, pausedRanges) / 28);
}

export function buildProgram(blockIndex, overrides = {}) {
  const result = {};
  for (const key of DAY_KEYS) {
    result[key] = {
      label: PROGRAM[key].label,
      exercises: PROGRAM[key].exercises.map((baseEx) => {
        const slotId = baseEx.id;
        const overrideId = overrides[slotId];
        if (overrideId && EXERCISE_CATALOG[overrideId]) {
          return { ...EXERCISE_CATALOG[overrideId], slotId };
        }
        const slot = SLOT_VARIANTS[slotId];
        if (!slot) return { ...baseEx, slotId };
        return { ...slot[blockIndex % slot.length], slotId };
      }),
    };
  }
  return result;
}

export function roundToHalf(n) {
  return Math.round(n / 2.5) * 2.5;
}

// history: { [exerciseId]: [{ date, sets: [{weight, reps}] }, ...] } sorted oldest -> newest
export function suggestNext(history, ex) {
  const sessions = (history[ex.id] || []).filter((s) => !s.skipped);
  if (sessions.length === 0) return { weight: null, note: "Enter your starting weight", tone: "neutral" };

  const last = sessions[sessions.length - 1];
  const gapDays = daysBetween(last.date, todayISO());
  const lastWeight = Math.max(...last.sets.map((s) => s.weight || 0));

  // Long gap (vacation, holidays, etc.) — don't push progression blindly
  if (gapDays >= 14) {
    const comebackWeight = roundToHalf(lastWeight * 0.85);
    return { weight: comebackWeight, note: `${gapDays}d since your last session — comeback at ${comebackWeight} lb (~85%)`, tone: "comeback" };
  }

  const allTop = last.sets.every((s) => s.reps >= ex.repMax);
  const anyBelowMin = last.sets.some((s) => s.reps < ex.repMin);

  // Stagnation check: last 3 sessions at the same weight, never hitting the top
  if (sessions.length >= 3) {
    const lastThree = sessions.slice(-3);
    const weights = lastThree.map((s) => Math.max(...s.sets.map((x) => x.weight || 0)));
    const sameWeight = weights.every((w) => w === weights[0]);
    const noneHitTop = lastThree.every((s) => !s.sets.every((x) => x.reps >= ex.repMax));
    if (sameWeight && noneHitTop) {
      const deloadWeight = roundToHalf(weights[0] * 0.9);
      return { weight: deloadWeight, note: `Stalled 3x at ${weights[0]} lb — deload to ${deloadWeight} lb`, tone: "deload" };
    }
  }

  if (allTop) {
    return { weight: lastWeight + ex.increment, note: `Move up to ${lastWeight + ex.increment} lb`, tone: "up" };
  }
  if (anyBelowMin) {
    return { weight: lastWeight, note: `Stay at ${lastWeight} lb, aim for the low end of the range`, tone: "hold" };
  }
  return { weight: lastWeight, note: `Stay at ${lastWeight} lb, add a rep`, tone: "hold" };
}
