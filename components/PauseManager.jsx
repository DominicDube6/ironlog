"use client";

import { useState } from "react";
import { fmtDate } from "@/lib/program";

export function PauseManager({ pausedRanges, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const submit = () => {
    if (label && start && end) {
      onAdd(label, start, end);
      setLabel("");
      setStart("");
      setEnd("");
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "1px solid #2E2B27", borderRadius: 6, padding: "6px 10px", color: "#9A958D", fontSize: 12, fontWeight: 700 }}
      >
        🛫 Breaks ({(pausedRanges || []).length}) {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{ background: "#1C1A18", border: "1px solid #2E2B27", borderRadius: 8, padding: 12, marginTop: 8 }}>
          {(pausedRanges || []).map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#B5B0A8", marginBottom: 6 }}>
              <span>{r.label} — {fmtDate(r.start)} to {fmtDate(r.end)}</span>
              <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: "#D97D75", fontSize: 12 }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            <input
              type="text"
              placeholder="e.g. Christmas, camping trip"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{ background: "#121110", border: "1px solid #2E2B27", borderRadius: 6, padding: "8px 10px", color: "#EDEAE3", fontSize: 13 }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ flex: 1, background: "#121110", border: "1px solid #2E2B27", borderRadius: 6, padding: "8px 10px", color: "#EDEAE3", fontSize: 12 }} />
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ flex: 1, background: "#121110", border: "1px solid #2E2B27", borderRadius: 6, padding: "8px 10px", color: "#EDEAE3", fontSize: 12 }} />
            </div>
            <button onClick={submit} style={{ padding: "8px 0", borderRadius: 6, border: "none", background: "#7FA8C9", color: "#121110", fontWeight: 800, fontSize: 12 }}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
