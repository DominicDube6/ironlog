import { createClient } from "@supabase/supabase-js";

// Hit once a day by the Vercel cron in vercel.json. A free Supabase project is
// paused after ~7 days without any API activity, which is exactly what happens
// when training stops for a week: the app then hangs on "Loading" and nothing
// saves. One tiny query a day keeps the project awake.
export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await supabase.from("profile").select("id").limit(1);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 502 });
  }
  return Response.json({ ok: true, at: new Date().toISOString() });
}
