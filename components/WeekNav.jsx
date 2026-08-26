"use client";

import { useState } from "react";
import { GOAL_WEEKS, SESSIONS_PER_WEEK } from "@/lib/goal";

export function WeekNav({ weekCounts, currentWeek }) {
  const [selected, setSelected] = useState(currentWeek);
  const count = weekCounts[selected] ?? 0;
  const done = count >= SESSIONS_PER_WEEK;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {Array.from({ length: GOAL_WEEKS }, (_, i) => {
          const wCount = weekCounts[i] ?? 0;
          const wDone = wCount >= SESSIONS_PER_WEEK;
          const isSelected = i === selected;
          const isCurrent = i === currentWeek;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`Week ${i + 1} — ${wCount}/${SESSIONS_PER_WEEK} sessions`}
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid " + (isSelected ? "#B5453B" : isCurrent ? "#7FA8C9" : "#2E2B27"),
                background: wDone ? "#C9A227" : isSelected ? "#2A1D1B" : "#1C1A18",
                color: wDone ? "#121110" : isSelected ? "#D97D75" : "#9A958D",
                fontWeight: 800,
                fontSize: 12,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: done ? "#C9A227" : "#6E6A63", fontFamily: "ui-monospace, monospace", marginTop: 6 }}>
        Week {selected + 1} — {count}/{SESSIONS_PER_WEEK} sessions{done ? " · complete" : ""}
        {selected === currentWeek ? " (current)" : ""}
      </div>
    </div>
  );
}
