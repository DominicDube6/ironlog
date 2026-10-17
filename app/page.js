"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { OWNER_ID } from "@/lib/owner";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PauseManager } from "@/components/PauseManager";
import { WeekNav } from "@/components/WeekNav";
import { CycleStart } from "@/components/CycleStart";
import { PROGRAM, DAY_KEYS, TRAIN_WEEKS, buildProgram, getBlockIndex, getCyclePosition, isDeloadDate, todayISO } from "@/lib/program";
import { GOAL_TARGET, countCompletedSessions, getCompletedSessionDates, getWeekCounts, getCurrentWeekIndex, planEndDate } from "@/lib/goal";

export default function IronLog() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState({});
  const [day, setDay] = useState("A");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("ok");
  const [profileError, setProfileError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const inFlight = useRef(new Set());

  useEffect(() => {
    const load = async () => {
      let { data: p, error: profileFetchError } = await supabase.from("profile").select("*").eq("user_id", OWNER_ID).maybeSingle();
      if (profileFetchError) setProfileError(profileFetchError.message);

      if (!p && !profileFetchError) {
        const { data: created, error } = await supabase
          .from("profile")
          .insert({ user_id: OWNER_ID, start_date: todayISO(), paused_ranges: [], exercise_overrides: {} })
          .select()
          .single();
        if (error) {
          setProfileError(error.message);
        } else {
          p = created;
        }
      }
      setProfile(p);

      const { data: rows, error: historyError } = await supabase
        .from("exercise_history")
        .select("exercise_id, date, sets, skipped")
        .eq("user_id", OWNER_ID)
        .order("date", { ascending: true });

      if (historyError) {
        setLoadError(historyError.message);
      } else {
        const grouped = {};
        for (const row of rows || []) {
          if (!grouped[row.exercise_id]) grouped[row.exercise_id] = [];
          grouped[row.exercise_id].push({ date: row.date, sets: row.sets, skipped: row.skipped });
        }
        setHistory(grouped);
      }
    };

    // Never hang on "Loading..." — if the database is unreachable (e.g. a free
    // Supabase project that got paused for inactivity), say so after 10s.
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("database not responding — it may be paused")), 10000)
    );
    Promise.race([load(), timeout])
      .catch((e) => setLoadError(e?.message || "network error"))
      .finally(() => setLoading(false));
  }, [supabase]);

  const persistProfile = async (p) => {
    setProfile(p);
    const { error } = await supabase
      .from("profile")
      .update({
        start_date: p.startDate ?? p.start_date,
        paused_ranges: p.pausedRanges ?? p.paused_ranges,
        exercise_overrides: p.exerciseOverrides ?? p.exercise_overrides,
      })
      .eq("user_id", OWNER_ID);
    setProfileError(error ? error.message : null);
  };

  const pausedRanges = profile?.paused_ranges ?? profile?.pausedRanges ?? [];
  const startDate = profile?.start_date ?? profile?.startDate;
  const exerciseOverrides = profile?.exercise_overrides ?? profile?.exerciseOverrides ?? {};

  const handleAddPause = async (label, start, end) => {
    const updated = { ...profile, paused_ranges: [...pausedRanges, { label, start, end }] };
    await persistProfile(updated);
  };

  const handleRemovePause = async (idx) => {
    const updated = { ...profile, paused_ranges: pausedRanges.filter((_, i) => i !== idx) };
    await persistProfile(updated);
  };

  const handleChangeExercise = async (slotId, newExerciseId) => {
    const updated = { ...profile, exercise_overrides: { ...exerciseOverrides, [slotId]: newExerciseId } };
    await persistProfile(updated);
  };

  const flash = (type, message) => {
    setToastType(type);
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const logToHistory = useCallback(
    async (exId, sets, skipped) => {
      // One entry per exercise per day. The ref blocks a fast double-tap that
      // fires twice before React has re-rendered the button as disabled.
      if (inFlight.current.has(exId)) return;
      const date = todayISO();
      const existing = (history[exId] || []).find((s) => s.date === date);
      if (existing && (!existing.skipped || skipped)) {
        flash("error", existing.skipped ? "Already skipped today" : "Already logged today");
        return;
      }

      inFlight.current.add(exId);
      let error;
      if (existing) {
        // Skipped earlier today, now logging it for real: replace the skip.
        ({ error } = await supabase
          .from("exercise_history")
          .update({ sets, skipped: false })
          .eq("user_id", OWNER_ID)
          .eq("exercise_id", exId)
          .eq("date", date));
      } else {
        ({ error } = await supabase.from("exercise_history").insert({
          user_id: OWNER_ID,
          exercise_id: exId,
          date,
          sets,
          skipped,
        }));
      }
      inFlight.current.delete(exId);

      if (error?.code === "23505") {
        flash("error", "Already logged today");
        return;
      }
      if (!error) {
        const others = (history[exId] || []).filter((s) => s.date !== date);
        const updated = { ...history, [exId]: [...others, { date, sets, skipped }] };
        const justCompleted =
          getCompletedSessionDates(updated, startDate).length > getCompletedSessionDates(history, startDate).length;
        setHistory(updated);

        if (justCompleted && isDeloadDate(startDate, pausedRanges, date)) {
          setToastType("ok");
          setToast("Deload session complete ✓");
        } else if (justCompleted) {
          const after = countCompletedSessions(updated, startDate, pausedRanges);
          const pct = Math.round((after / GOAL_TARGET) * 100);
          setToastType("goal");
          setToast(`Session complete — ${after}/${GOAL_TARGET} (${pct}%) toward your goal`);
        } else {
          setToastType("ok");
          setToast(skipped ? "Exercise skipped" : "Session logged ✓");
        }
      } else {
        setToastType("error");
        setToast(`⚠ Save failed (${error.message}) — try again`);
      }
      setTimeout(() => setToast(""), 2500);
    },
    [supabase, history, startDate, pausedRanges]
  );

  const handleSaveExercise = useCallback((exId, sets) => logToHistory(exId, sets, false), [logToHistory]);
  const handleSkipExercise = useCallback((exId) => logToHistory(exId, [], true), [logToHistory]);

  const handleChangeStart = async (date) => {
    await persistProfile({ ...profile, start_date: date });
  };

  // Tag deload-week sessions so suggestNext keeps them out of progression.
  // Derived (not stored), so moving the cycle start re-tags everything.
  const taggedHistory = useMemo(() => {
    const out = {};
    for (const [exId, sessions] of Object.entries(history)) {
      out[exId] = sessions.map((s) => ({ ...s, deload: isDeloadDate(startDate, pausedRanges, s.date) }));
    }
    return out;
  }, [history, startDate, pausedRanges]);

  if (loading) {
    return (
      <div style={{ background: "#121110", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6E6A63" }}>
        Loading...
      </div>
    );
  }

  const blockIndex = startDate ? getBlockIndex(startDate, pausedRanges) : 0;
  const program = buildProgram(blockIndex, exerciseOverrides);
  const cyclePos = startDate ? getCyclePosition(startDate, pausedRanges) : { cycle: 0, week: 0, isDeload: false, daysUntilNextCycle: 0 };
  const isDeload = cyclePos.isDeload;

  const completedSessions = countCompletedSessions(history, startDate, pausedRanges);
  const goalPct = Math.min(100, Math.round((completedSessions / GOAL_TARGET) * 100));
  const endDate = planEndDate(startDate, pausedRanges);
  const goalDeadlineLabel = endDate
    ? new Date(endDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";
  const weekCounts = getWeekCounts(startDate, pausedRanges, history);
  const currentWeek = getCurrentWeekIndex(startDate, pausedRanges);

  return (
    <div style={{ background: "#121110", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 14px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#EDEAE3", letterSpacing: -0.5, textTransform: "uppercase" }}>Iron Log</div>
          <div style={{ fontSize: 11, color: "#6E6A63", fontFamily: "ui-monospace, monospace" }}>Full body · 4x/week</div>
        </div>
        <div style={{ fontSize: 11, color: "#7FA8C9", fontFamily: "ui-monospace, monospace", marginBottom: 12 }}>
          Cycle {cyclePos.cycle + 1} · {isDeload ? "Deload week" : `Week ${cyclePos.week + 1} of ${TRAIN_WEEKS}`} · variations rotate in {cyclePos.daysUntilNextCycle}d
        </div>

        {isDeload && (
          <div style={{ background: "#16222B", border: "1px solid #3F6A8A", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#7FA8C9" }}>
            Deload week — weights ~85%, one fewer set, bottom of the rep range, 3+ reps in the tank. Your working weights come back next week.
          </div>
        )}

        {loadError && (
          <div style={{ background: "#332018", border: "1px solid #D97D75", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#D97D75" }}>
            ⚠ Couldn&apos;t load your training history ({loadError}). Don&apos;t log anything yet — it won&apos;t save. If this keeps happening, check that your Supabase project isn&apos;t paused (supabase.com/dashboard → Restore project).
          </div>
        )}

        <WeekNav weekCounts={weekCounts} currentWeek={currentWeek} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "ui-monospace, monospace", color: "#9A958D", marginBottom: 4 }}>
            <span>Goal: {completedSessions}/{GOAL_TARGET} sessions by {goalDeadlineLabel}</span>
            <span style={{ color: "#C9A227", fontWeight: 700 }}>{goalPct}%</span>
          </div>
          <div style={{ height: 6, width: "100%", background: "#241F1B", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${goalPct}%`, background: "#C9A227", borderRadius: 3 }} />
          </div>
        </div>

        <CycleStart key={startDate} startDate={startDate} onChange={handleChangeStart} />

        <PauseManager pausedRanges={pausedRanges} onAdd={handleAddPause} onRemove={handleRemovePause} />

        {profileError && (
          <div style={{ fontSize: 11, color: "#D97D75", marginBottom: 12 }}>⚠ Profile save failed ({profileError})</div>
        )}

        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {DAY_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setDay(k)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                border: "1px solid " + (day === k ? "#B5453B" : "#2E2B27"),
                background: day === k ? "#2A1D1B" : "#1C1A18",
                color: day === k ? "#D97D75" : "#9A958D",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {PROGRAM[k].label}
            </button>
          ))}
        </div>

        {program[day].exercises.map((ex) => (
          <ExerciseCard
            key={ex.slotId}
            ex={ex}
            history={taggedHistory}
            deload={isDeload}
            todayEntry={(history[ex.id] || []).find((s) => s.date === todayISO())}
            onSave={handleSaveExercise}
            onSkip={handleSkipExercise}
            onChangeExercise={handleChangeExercise}
          />
        ))}
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "90%",
            textAlign: "center",
            background: toastType === "error" ? "#3B2A2A" : toastType === "goal" ? "#332C18" : "#2A3B2E",
            color: toastType === "error" ? "#D97D75" : toastType === "goal" ? "#C9A227" : "#7BC48F",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
