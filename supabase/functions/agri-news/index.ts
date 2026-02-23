import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractGoogleNewsItems(xml: string) {
  const items: any[] = [];
  const itemRegex = /<item>(.*?)<\/item>/gs;
  let match;
  let debugCount = 0;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || "";
    const description = block.match(/<description>(.*?)<\/description>/s)?.[1]
      ?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
      ?.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
      ?.replace(/<[^>]*>/g, "")?.replace(/&nbsp;/g, " ")?.trim() || "";
    
    // Extract source URL and name - try multiple patterns
    const sourceMatch = block.match(/<source[^>]*url="([^"]*)"[^>]*>(.*?)<\/source>/s);
    const sourceUrl = sourceMatch?.[1]?.trim() || "";
    const sourceName = sourceMatch?.[2]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
    
    // Get the Google News link as fallback
    const linkMatch = block.match(/<link\s*\/?>(https?:\/\/[^<\s]+)/);
    const googleLink = linkMatch?.[1]?.trim() || "";
    
    // Debug first few items
    if (debugCount < 3) {
      console.log("Item:", title.substring(0, 50), "sourceUrl:", sourceUrl, "sourceName:", sourceName, "hasLink:", !!googleLink);
      debugCount++;
    }
    
    // Use source URL if available, otherwise use Google link
    const link = sourceUrl || googleLink;
    
    if (title && link) {
      items.push({ title, link, pubDate, description, source: sourceName });
    }
  }
  return items;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const lang = body.lang || "en";

    // Use Google News RSS but extract the source URL (publisher website) instead of the Google redirect link
    // More diverse queries to get 7 days of agriculture news
    const queries = lang === "te"
      ? ["వ్యవసాయం+తెలుగు", "agriculture+Andhra+Pradesh+Telangana", "రైతు+పంట+India", "వ్యవసాయం+రైతు+భరోసా", "agriculture+farming+Telugu"]
      : ["agriculture+farming+India", "crop+prices+India+farmers", "agriculture+scheme+India+government", "Indian+agriculture+news+today", "farming+India+crop+weather"];

    const allItems: any[] = [];

    // Fetch all queries in parallel
    const results = await Promise.allSettled(
      queries.map(async (q) => {
        try {
          const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang === "te" ? "te" : "en"}-IN&gl=IN&ceid=IN:${lang === "te" ? "te" : "en"}`;
          const resp = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AgriNewsBot/1.0)" },
          });
          console.log("RSS status:", resp.status, "for", q);
          if (resp.ok) {
            const xml = await resp.text();
            const items = extractGoogleNewsItems(xml);
            console.log("Parsed items:", items.length, "for", q);
            return items;
          }
        } catch (e) {
          console.error("RSS fetch error:", e);
        }
        return [];
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }

    // Deduplicate by title
    const seen = new Set<string>();
    const unique = allItems.filter((item) => {
      const key = item.title.toLowerCase().substring(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Filter to last 7 days only
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = unique.filter((item) => {
      const itemTime = new Date(item.pubDate).getTime();
      return !isNaN(itemTime) && itemTime >= sevenDaysAgo;
    });

    // Sort by date descending
    recent.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Return up to 40 items with FULL descriptions (no truncation)
    const news = recent.slice(0, 40).map((item, i) => ({
      id: `news-${i}`,
      title: item.title,
      description: item.description || "",
      link: item.link,
      source: item.source || "",
      published_at: item.pubDate,
    }));

    return new Response(JSON.stringify({ news, total: news.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Agri news error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
