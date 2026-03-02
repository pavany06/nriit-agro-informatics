import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_TABLES = ["alerts", "schemes", "videos", "mandis", "farming_methods", "news", "feedback"] as const;
type AllowedTable = typeof ALLOWED_TABLES[number];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { table, action, filters, limit, offset, record } = body;

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return json({ error: `Invalid table. Allowed: ${ALLOWED_TABLES.join(", ")}` }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Use anon key so RLS policies are respected
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // INSERT operation (only for feedback)
    if (action === "insert") {
      if (table !== "feedback") {
        return json({ error: "Insert only allowed on feedback table" }, 403);
      }
      if (!record || !record.message) {
        return json({ error: "record.message is required" }, 400);
      }

      const { data, error } = await supabase
        .from("feedback")
        .insert({
          message: record.message,
          name: record.name || null,
          mobile: record.mobile || null,
          feedback_type: record.feedback_type || "feedback",
        })
        .select("id")
        .single();

      if (error) return json({ error: error.message }, 400);
      return json({ success: true, id: data.id });
    }

    // SELECT operation (default)
    let query = supabase.from(table as AllowedTable).select("*", { count: "exact" });

    // Apply filters
    if (filters && typeof filters === "object") {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
    }

    // Apply ordering (newest first)
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    if (limit) query = query.limit(Number(limit));
    if (offset) query = query.range(Number(offset), Number(offset) + (Number(limit) || 20) - 1);

    const { data, error, count } = await query;
    if (error) return json({ error: error.message }, 400);

    return json({ data, count });
  } catch (e) {
    console.error("Data endpoint error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
