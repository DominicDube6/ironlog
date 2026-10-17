"use client";

import { useState } from "react";
import { fmtDate } from "@/lib/program";

export function CycleStart({ startDate, onChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(startDate || "");

  const save = () => {
    if (value && value !== startDate) onChange(value);
    setOpen(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "1px solid #2E2B27", borderRadius: 6, padding: "6px 10px", color: "#9A958D", fontSize: 12, fontWeight: 700 }}
      >
        📅 Cycle start: {startDate ? fmtDate(startDate) : "—"} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{ background: "#1C1A18", border: "1px solid #2E2B27", borderRadius: 8, padding: 12, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "#9A958D", marginBottom: 8 }}>
            First day of week 1 of your 6-week progression + 1 deload cycle. Weeks, deload timing and your goal dates all count from here, and sessions logged before it don&apos;t count toward the goal.
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="date"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ flex: 1, background: "#121110", border: "1px solid #2E2B27", borderRadius: 6, padding: "8px 10px", color: "#EDEAE3", fontSize: 13 }}
            />
            <button onClick={save} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: "#7FA8C9", color: "#121110", fontWeight: 800, fontSize: 12 }}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
