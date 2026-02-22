import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lat, lon } = await req.json();
    const API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");
    if (!API_KEY) throw new Error("API key not configured");

    const url = `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      console.error("Agromonitoring error:", resp.status, text);
      throw new Error(`Agromonitoring API error: ${resp.status}`);
    }

    const data = await resp.json();

    // Agromonitoring returns temp in Kelvin
    const result = {
      temp: Math.round(data.main.temp - 273.15),
      feels_like: Math.round(data.main.feels_like - 273.15),
      humidity: data.main.humidity,
      wind: Math.round((data.wind?.speed || 0) * 3.6), // m/s to km/h
      condition: data.weather?.[0]?.description || "Clear",
      icon: data.weather?.[0]?.icon || "01d",
      city: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Weather error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
