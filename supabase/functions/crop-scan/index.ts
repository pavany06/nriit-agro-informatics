import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert agricultural plant pathologist. Analyze the crop image and respond in the following JSON format ONLY (no markdown, no explanation):
{
  "disease_te": "తెలుగులో రోగం పేరు",
  "disease_en": "Disease name in English",
  "severity_te": "తీవ్రత (తక్కువ/మధ్యస్థం/అధికం)",
  "severity_en": "low/medium/high",
  "treatment_te": "సరళమైన తెలుగులో చికిత్స సూచనలు - 2-3 వాక్యాలు",
  "treatment_en": "Treatment advice in English",
  "healthy": false
}
If the crop looks healthy, set "healthy" to true and provide a positive message.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Identify the crop disease in this image and provide treatment advice." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "దయచేసి కొద్దిసేపట్లో మళ్ళీ ప్రయత్నించండి." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Crop scan error:", response.status, t);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse response" };
    } catch {
      result = { disease_te: content, disease_en: content, severity_te: "తెలియదు", severity_en: "unknown", treatment_te: content, treatment_en: content, healthy: false };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Crop scan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
