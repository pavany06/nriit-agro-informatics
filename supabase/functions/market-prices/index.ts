import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { commodity, state } = await req.json();
    const API_KEY = Deno.env.get("DATA_GOV_IN_API_KEY");
    if (!API_KEY) throw new Error("API key not configured");

    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: "200",
    });

    // If a specific state is requested, filter by it
    if (state) {
      params.set("filters[state.keyword]", state);
    }

    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${params.toString()}`;
    console.log("Fetching:", url);

    const resp = await fetch(url);
    if (!resp.ok) {
      console.error("data.gov.in error", resp.status);
      throw new Error("API error");
    }

    const data = await resp.json();
    let allRecords = data.records || [];

    // Filter by commodity name (case-insensitive partial match)
    if (commodity) {
      const searchTerm = commodity.toLowerCase().trim();
      allRecords = allRecords.filter((r: any) =>
        r.commodity?.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(r.commodity?.toLowerCase())
      );
    }

    const records = allRecords.map((r: any) => ({
      commodity: r.commodity,
      variety: r.variety,
      market: r.market,
      district: r.district,
      state: r.state,
      min_price: Number(r.min_price),
      max_price: Number(r.max_price),
      modal_price: Number(r.modal_price),
      arrival_date: r.arrival_date,
    }));

    return new Response(JSON.stringify({ records, total: records.length, count: records.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Market prices error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
