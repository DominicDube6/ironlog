"use client";

import { useState } from "react";
import { PLAN_WEEKS, SESSIONS_PER_WEEK, weekMeta } from "@/lib/goal";

export function WeekNav({ weekCounts, currentWeek }) {
  const [selected, setSelected] = useState(currentWeek);
  const count = weekCounts[selected] ?? 0;
  const meta = weekMeta(selected);
  const done = count >= SESSIONS_PER_WEEK;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {Array.from({ length: PLAN_WEEKS }, (_, i) => {
          const m = weekMeta(i);
          const wDone = (weekCounts[i] ?? 0) >= SESSIONS_PER_WEEK;
          const isSelected = i === selected;
          const isCurrent = i === currentWeek;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`${m.title} — ${weekCounts[i] ?? 0}/${SESSIONS_PER_WEEK} sessions`}
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: 8,
                border:
                  "1px " + (m.deload ? "dashed " : "solid ") +
                  (isSelected ? "#B5453B" : isCurrent ? "#7FA8C9" : m.deload ? "#3F6A8A" : "#2E2B27"),
                background: wDone ? (m.deload ? "#7FA8C9" : "#C9A227") : isSelected ? "#2A1D1B" : "#1C1A18",
                color: wDone ? "#121110" : isSelected ? "#D97D75" : m.deload ? "#7FA8C9" : "#9A958D",
                fontWeight: 800,
                fontSize: 12,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: done ? (meta.deload ? "#7FA8C9" : "#C9A227") : "#6E6A63", fontFamily: "ui-monospace, monospace", marginTop: 6 }}>
        {meta.title} — {count}/{SESSIONS_PER_WEEK} sessions{done ? " · complete" : ""}
        {selected === currentWeek ? " (current)" : ""}
      </div>
    </div>
  );
}
