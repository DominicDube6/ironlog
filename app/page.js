"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PauseManager } from "@/components/PauseManager";
import { PROGRAM, DAY_KEYS, buildProgram, effectiveDays, getBlockIndex, todayISO } from "@/lib/program";

export default function IronLog() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState({});
  const [day, setDay] = useState("A");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("ok");
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      let { data: p } = await supabase.from("profile").select("*").eq("user_id", user.id).maybeSingle();

      if (!p) {
        const { data: created, error } = await supabase
          .from("profile")
          .insert({ user_id: user.id, start_date: todayISO(), paused_ranges: [] })
          .select()
          .single();
        if (error) {
          setProfileError(error.message);
        } else {
          p = created;
        }
      }
      setProfile(p);

      const { data: rows } = await supabase
        .from("exercise_history")
        .select("exercise_id, date, sets")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      const grouped = {};
      for (const row of rows || []) {
        if (!grouped[row.exercise_id]) grouped[row.exercise_id] = [];
        grouped[row.exercise_id].push({ date: row.date, sets: row.sets });
      }
      setHistory(grouped);
      setLoading(false);
    })();
  }, [supabase]);

  const persistProfile = async (p) => {
    setProfile(p);
    const { error } = await supabase
      .from("profile")
      .update({ start_date: p.startDate ?? p.start_date, paused_ranges: p.pausedRanges ?? p.paused_ranges })
      .eq("user_id", userId);
    setProfileError(error ? error.message : null);
  };

  const pausedRanges = profile?.paused_ranges ?? profile?.pausedRanges ?? [];
  const startDate = profile?.start_date ?? profile?.startDate;

  const handleAddPause = async (label, start, end) => {
    const updated = { ...profile, paused_ranges: [...pausedRanges, { label, start, end }] };
    await persistProfile(updated);
  };

  const handleRemovePause = async (idx) => {
    const updated = { ...profile, paused_ranges: pausedRanges.filter((_, i) => i !== idx) };
    await persistProfile(updated);
  };

  const handleSaveExercise = useCallback(
    async (exId, sets) => {
      const date = todayISO();
      const { error } = await supabase.from("exercise_history").insert({
        user_id: userId,
        exercise_id: exId,
        date,
        sets,
      });
      if (!error) {
        setHistory((h) => ({ ...h, [exId]: [...(h[exId] || []), { date, sets }] }));
        setToastType("ok");
        setToast("Séance loggée ✓");
      } else {
        setToastType("error");
        setToast(`⚠ Sauvegarde échouée (${error.message}) — réessaie`);
      }
      setTimeout(() => setToast(""), 2500);
    },
    [supabase, userId]
  );

  if (loading) {
    return (
      <div style={{ background: "#121110", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6E6A63" }}>
        Chargement...
      </div>
    );
  }

  const blockIndex = startDate ? getBlockIndex(startDate, pausedRanges) : 0;
  const program = buildProgram(blockIndex);
  const effDays = startDate ? effectiveDays(startDate, pausedRanges) : 0;
  const daysUntilNextBlock = 28 - (effDays % 28);

  return (
    <div style={{ background: "#121110", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 14px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#EDEAE3", letterSpacing: -0.5, textTransform: "uppercase" }}>Iron Log</div>
          <div style={{ fontSize: 11, color: "#6E6A63", fontFamily: "ui-monospace, monospace" }}>Full body · 4x/sem</div>
        </div>
        <div style={{ fontSize: 11, color: "#7FA8C9", fontFamily: "ui-monospace, monospace", marginBottom: 12 }}>
          Bloc {blockIndex + 1} · prochaine rotation d&apos;accessoires dans {daysUntilNextBlock}j
        </div>

        <PauseManager pausedRanges={pausedRanges} onAdd={handleAddPause} onRemove={handleRemovePause} />

        {profileError && (
          <div style={{ fontSize: 11, color: "#D97D75", marginBottom: 12 }}>⚠ Sauvegarde du profil échouée ({profileError})</div>
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
          <ExerciseCard key={ex.id} ex={ex} history={history} onSave={handleSaveExercise} />
        ))}

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          style={{ background: "none", border: "none", color: "#6E6A63", fontSize: 12, marginTop: 20, padding: 0 }}
        >
          Déconnexion
        </button>
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
            background: toastType === "error" ? "#3B2A2A" : "#2A3B2E",
            color: toastType === "error" ? "#D97D75" : "#7BC48F",
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
