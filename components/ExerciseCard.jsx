"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { PatternIcon, StickFigure } from "./StickFigure";
import { PlateBar } from "./PlateBar";
import { suggestNext, fmtDate } from "@/lib/program";

export function ExerciseCard({ ex, history, onSave }) {
  const suggestion = suggestNext(history, ex);
  const [rows, setRows] = useState(
    Array.from({ length: ex.sets }, () => ({ weight: suggestion.weight ?? "", reps: "" }))
  );
  const [open, setOpen] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateRow = (i, field, val) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  };

  const canSave = rows.every((r) => r.weight !== "" && r.reps !== "") && !saving;

  const handleSave = async () => {
    const sets = rows.map((r) => ({ weight: Number(r.weight), reps: Number(r.reps) }));
    setSaving(true);
    await onSave(ex.id, sets);
    setSaving(false);
  };

  const sessions = history[ex.id] || [];

  return (
    <div style={{ background: "#1C1A18", border: "1px solid #2E2B27", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <PatternIcon pattern={ex.pattern} />
            <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7FA8C9", fontWeight: 700 }}>{ex.cat}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#EDEAE3", letterSpacing: -0.3 }}>{ex.name}</span>
            <button
              onClick={() => setShowHowTo((o) => !o)}
              aria-label="How to do this exercise"
              style={{ background: "none", border: "none", padding: 2, display: "flex", alignItems: "center" }}
            >
              <HelpCircle size={16} color={showHowTo ? "#C9A227" : "#6E6A63"} />
            </button>
          </div>
        </div>
        <button onClick={() => setOpen((o) => !o)} style={{ background: "none", border: "none", color: "#7FA8C9", fontSize: 12, fontWeight: 700 }}>
          {open ? "CLOSE" : "HISTORY"}
        </button>
      </div>

      {showHowTo && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#141210", border: "1px solid #2E2B27", borderRadius: 8, padding: "10px 12px", margin: "8px 0" }}>
          <div style={{ flexShrink: 0 }}>
            <StickFigure pattern={ex.pattern} />
          </div>
          <div style={{ fontSize: 13, color: "#B5B0A8" }}>{ex.desc}</div>
        </div>
      )}

      <div style={{ margin: "8px 0 10px" }}>
        <PlateBar weight={suggestion.weight} />
      </div>

      <div
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 13,
          color: suggestion.tone === "up" ? "#C9A227" : suggestion.tone === "deload" ? "#D97D75" : suggestion.tone === "comeback" ? "#7FA8C9" : "#9A958D",
          marginBottom: 10,
        }}
      >
        {ex.sets}×{ex.repMin}-{ex.repMax} · {suggestion.note}
      </div>

      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
          <span style={{ width: 18, fontSize: 12, color: "#6E6A63", fontFamily: "ui-monospace, monospace" }}>{i + 1}</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="lb"
            value={row.weight}
            onChange={(e) => updateRow(i, "weight", e.target.value)}
            style={{
              flex: 1,
              background: "#121110",
              border: "1px solid #2E2B27",
              borderRadius: 6,
              padding: "8px 10px",
              color: "#EDEAE3",
              fontFamily: "ui-monospace, monospace",
              fontSize: 15,
            }}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="reps"
            value={row.reps}
            onChange={(e) => updateRow(i, "reps", e.target.value)}
            style={{
              flex: 1,
              background: "#121110",
              border: "1px solid #2E2B27",
              borderRadius: 6,
              padding: "8px 10px",
              color: "#EDEAE3",
              fontFamily: "ui-monospace, monospace",
              fontSize: 15,
            }}
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={!canSave}
        style={{
          width: "100%",
          marginTop: 6,
          padding: "10px 0",
          borderRadius: 8,
          border: "none",
          background: canSave ? "#B5453B" : "#2E2B27",
          color: canSave ? "#EDEAE3" : "#6E6A63",
          fontWeight: 800,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          fontSize: 13,
        }}
      >
        {saving ? "..." : "Log Session"}
      </button>

      {open && (
        <div style={{ marginTop: 10, borderTop: "1px solid #2E2B27", paddingTop: 8 }}>
          {sessions.length === 0 && <div style={{ fontSize: 12, color: "#6E6A63" }}>No sessions logged yet.</div>}
          {sessions
            .slice(-5)
            .reverse()
            .map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: "#9A958D", fontFamily: "ui-monospace, monospace", marginBottom: 4 }}>
                {fmtDate(s.date)} — {s.sets.map((st) => `${st.weight}×${st.reps}`).join(", ")}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
