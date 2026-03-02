import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, email, password, refresh_token, access_token } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Admin client for signup operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Regular client for user-facing auth operations
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    switch (action) {
      case "signup": {
        if (!email || !password) return json({ error: "email and password required" }, 400);
        const { data, error } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (error) return json({ error: error.message }, 400);

        // Sign in immediately to get tokens
        const { data: session, error: signInError } =
          await anonClient.auth.signInWithPassword({ email, password });
        if (signInError) return json({ error: signInError.message }, 400);

        return json({
          access_token: session.session?.access_token,
          refresh_token: session.session?.refresh_token,
          expires_in: session.session?.expires_in,
          user: { id: data.user.id, email: data.user.email },
        });
      }

      case "login": {
        if (!email || !password) return json({ error: "email and password required" }, 400);
        const { data, error } = await anonClient.auth.signInWithPassword({ email, password });
        if (error) return json({ error: error.message }, 401);

        return json({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_in: data.session?.expires_in,
          user: { id: data.user?.id, email: data.user?.email },
        });
      }

      case "refresh": {
        if (!refresh_token) return json({ error: "refresh_token required" }, 400);
        const { data, error } = await anonClient.auth.refreshSession({ refresh_token });
        if (error) return json({ error: error.message }, 401);

        return json({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_in: data.session?.expires_in,
        });
      }

      case "logout": {
        if (!access_token) return json({ error: "access_token required" }, 400);
        // Use admin client to revoke session
        const userClient = createClient(supabaseUrl, anonKey, {
          global: { headers: { Authorization: `Bearer ${access_token}` } },
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error } = await userClient.auth.signOut();
        if (error) return json({ error: error.message }, 400);
        return json({ success: true });
      }

      case "reset-password": {
        if (!email) return json({ error: "email required" }, 400);
        const { error } = await adminClient.auth.admin.generateLink({
          type: "recovery",
          email,
        });
        if (error) return json({ error: error.message }, 400);
        return json({ success: true, message: "Password reset email sent" });
      }

      default:
        return json({ error: `Unknown action: ${action}. Valid: signup, login, logout, refresh, reset-password` }, 400);
    }
  } catch (e) {
    console.error("Auth error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
