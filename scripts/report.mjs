#!/usr/bin/env node
// Prints a snapshot of training progression straight from Supabase.
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings -> API -> service_role).
// Usage: node scripts/report.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { PROGRAM } from "../lib/program.js";
import { OWNER_ID } from "../lib/owner.js";

function loadEnvLocal() {
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Get the service_role key from Supabase -> Project Settings -> API (keep it secret, never commit it)."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { params: { eventsPerSecond: 0 } },
});

const EXERCISE_NAME = {};
for (const day of Object.values(PROGRAM)) {
  for (const ex of day.exercises) EXERCISE_NAME[ex.id] = ex.name;
}

const { data: rows, error } = await supabase
  .from("exercise_history")
  .select("exercise_id, date, sets")
  .eq("user_id", OWNER_ID)
  .order("date", { ascending: true });

if (error) {
  console.error("Supabase error:", error.message);
  process.exit(1);
}

if (!rows || rows.length === 0) {
  console.log("Aucune séance loggée encore.");
} else {
  const byExercise = {};
  for (const r of rows) {
    (byExercise[r.exercise_id] ??= []).push(r);
  }

  const today = new Date();
  console.log(`Iron Log — snapshot au ${today.toISOString().slice(0, 10)}\n`);

  for (const [exId, sessions] of Object.entries(byExercise)) {
    const name = EXERCISE_NAME[exId] || exId;
    const last = sessions[sessions.length - 1];
    const lastWeight = Math.max(...last.sets.map((s) => s.weight || 0));
    const daysSince = Math.round((today - new Date(last.date + "T00:00:00")) / 86400000);
    const best = Math.max(...sessions.flatMap((s) => s.sets.map((x) => x.weight || 0)));
    console.log(
      `${name.padEnd(32)} dernier: ${lastWeight}lb (il y a ${daysSince}j) · PR: ${best}lb · séances: ${sessions.length}`
    );
  }
}

// Force-closing here (instead of letting the event loop drain naturally) triggers a
// Node/libuv assertion crash on Windows when undici's keep-alive socket is still open.
process.exitCode = 0;
