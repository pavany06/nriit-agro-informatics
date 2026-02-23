import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractItems(xml: string) {
  const items: any[] = [];
  // Google RSS uses self-closing or unclosed <link> tags: <link>URL<pubDate>
  const itemRegex = /<item>(.*?)<\/item>/gs;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
    // Google News RSS: <link/>URL<pubDate> or <link>URL<something
    const linkMatch = block.match(/<link\s*\/?>(https?:\/\/[^<\s]+)/);
    const link = linkMatch?.[1]?.trim() || "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || "";
    const description = block.match(/<description>(.*?)<\/description>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/<[^>]*>/g, "")?.replace(/&nbsp;/g, " ")?.trim() || "";
    const source = block.match(/<source[^>]*>(.*?)<\/source>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
    if (title) {
      items.push({ title, link, pubDate, description, source });
    }
  }
  return items;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const lang = body.lang || "en";

    // Fetch from multiple agriculture-related Google News RSS feeds
    const queries = lang === "te"
      ? ["agriculture+farming+India+Telugu", "వ్యవసాయం", "agriculture+Andhra+Pradesh+Telangana"]
      : ["agriculture+farming+India", "crop+prices+India+farmers", "agriculture+scheme+India"];

    const allItems: any[] = [];

    for (const q of queries) {
      try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang === "te" ? "te" : "en"}-IN&gl=IN&ceid=IN:${lang === "te" ? "te" : "en"}`;
        const resp = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AgriNewsBot/1.0)" },
        });
        console.log("RSS status:", resp.status, "for", q);
        if (resp.ok) {
          const xml = await resp.text();
          console.log("XML length:", xml.length, "has <item>:", xml.includes("<item>"));
          const items = extractItems(xml);
          console.log("Parsed items:", items.length);
          allItems.push(...items);
        }
      } catch (e) {
        console.error("RSS fetch error:", e);
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

    // Sort by date descending
    unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Return top 30
    const news = unique.slice(0, 30).map((item, i) => ({
      id: `news-${i}`,
      title: item.title,
      description: item.description,
      link: item.link,
      source: item.source,
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
