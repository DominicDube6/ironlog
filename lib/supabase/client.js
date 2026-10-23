import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Every request gives up after this long instead of hanging forever. A PWA
// resumed after days in the background can have a dead socket; without a
// timeout the "Log Session" button would stay stuck on "..." with no message.
const REQUEST_TIMEOUT_MS = 15000;

function fetchWithTimeout(input, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (init.signal) {
    init.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// Personal single-user app: no login, no session to persist or refresh. A plain
// client with auth disabled has no storage, no cross-tab locks and nothing that
// can wedge itself when the phone suspends and resumes the page.
export function createClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithTimeout },
  });
}
