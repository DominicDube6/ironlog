"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { OWNER_ID } from "@/lib/owner";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PauseManager } from "@/components/PauseManager";
import { WeekNav } from "@/components/WeekNav";
import { PROGRAM, DAY_KEYS, buildProgram, effectiveDays, getBlockIndex, todayISO } from "@/lib/program";
import { GOAL_TARGET, GOAL_DEADLINE, countCompletedSessions, getWeekCounts, getCurrentWeekIndex } from "@/lib/goal";

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

  useEffect(() => {
    (async () => {
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
      setLoading(false);
    })();
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

  const logToHistory = useCallback(
    async (exId, sets, skipped) => {
      const date = todayISO();
      const { error } = await supabase.from("exercise_history").insert({
        user_id: OWNER_ID,
        exercise_id: exId,
        date,
        sets,
        skipped,
      });
      if (!error) {
        const before = countCompletedSessions(history);
        const updated = { ...history, [exId]: [...(history[exId] || []), { date, sets, skipped }] };
        const after = countCompletedSessions(updated);
        setHistory(updated);

        if (after > before) {
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
    [supabase, history]
  );

  const handleSaveExercise = useCallback((exId, sets) => logToHistory(exId, sets, false), [logToHistory]);
  const handleSkipExercise = useCallback((exId) => logToHistory(exId, [], true), [logToHistory]);

  if (loading) {
    return (
      <div style={{ background: "#121110", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6E6A63" }}>
        Loading...
      </div>
    );
  }

  const blockIndex = startDate ? getBlockIndex(startDate, pausedRanges) : 0;
  const program = buildProgram(blockIndex, exerciseOverrides);
  const effDays = startDate ? effectiveDays(startDate, pausedRanges) : 0;
  const daysUntilNextBlock = 28 - (effDays % 28);

  const completedSessions = countCompletedSessions(history);
  const goalPct = Math.min(100, Math.round((completedSessions / GOAL_TARGET) * 100));
  const goalDeadlineLabel = new Date(GOAL_DEADLINE + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
          Block {blockIndex + 1} · next accessory rotation in {daysUntilNextBlock}d
        </div>

        {loadError && (
          <div style={{ background: "#332018", border: "1px solid #D97D75", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#D97D75" }}>
            ⚠ Couldn&apos;t load your training history ({loadError}). Your logged data is safe in the database — this is just a display problem. Try reloading the page.
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
            history={history}
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
