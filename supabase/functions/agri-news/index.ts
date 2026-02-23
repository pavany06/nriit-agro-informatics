import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractItems(xml: string) {
  const items: any[] = [];
  const itemRegex = /<item>(.*?)<\/item>/gs;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
    // Try standard <link> tag
    let link = block.match(/<link>(https?:\/\/[^<\s]+)<\/link>/)?.[1]?.trim() || "";
    if (!link) {
      // Google RSS style: <link/>URL or <link>URL<something
      const altMatch = block.match(/<link\s*\/?>(https?:\/\/[^<\s]+)/);
      link = altMatch?.[1]?.trim() || "";
    }
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || "";
    const description = block.match(/<description>(.*?)<\/description>/s)?.[1]
      ?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
      ?.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
      ?.replace(/<[^>]*>/g, "")?.replace(/&nbsp;/g, " ")?.trim() || "";
    const source = block.match(/<source[^>]*>(.*?)<\/source>/s)?.[1]
      ?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
    // Also try dc:creator or author
    const author = block.match(/<dc:creator>(.*?)<\/dc:creator>/s)?.[1]?.trim() ||
      block.match(/<author>(.*?)<\/author>/s)?.[1]?.trim() || "";
    if (title && link && !link.includes("news.google.com")) {
      items.push({ title, link, pubDate, description, source: source || author, });
    }
  }
  return items;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const lang = body.lang || "en";

    // Use RSS feeds that provide direct article links (not Google News redirects)
    const feeds = [
      // Down To Earth - Indian agriculture & environment
      "https://www.downtoearth.org.in/rss/agriculture",
      // IBEF agriculture blog
      "https://www.ibef.org/blogs/category/agriculture/feed",
      // Roy's Farm
      "https://www.roysfarm.com/feed/",
      // Krishak Jagat (agriculture news)
      "https://krishakjagat.org/feed/",
      // Agri Farming
      "https://www.agrifarming.in/feed",
    ];

    // For Telugu, also add Telugu agriculture feeds
    if (lang === "te") {
      feeds.push(
        "https://telugu.oneindia.com/rss/telugu-andhra-pradesh-news-fb.xml",
        "https://www.sakshi.com/rss/telangana",
      );
    }

    const allItems: any[] = [];

    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      feeds.map(async (feedUrl) => {
        try {
          const resp = await fetch(feedUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AgriNewsBot/1.0)" },
          });
          console.log("RSS status:", resp.status, "for", feedUrl);
          if (resp.ok) {
            const xml = await resp.text();
            return extractItems(xml);
          }
        } catch (e) {
          console.error("RSS fetch error for", feedUrl, e);
        }
        return [];
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }

    console.log("Total items from all feeds:", allItems.length);

    // If direct feeds returned too few items, supplement with Google News RSS
    // but use the source URL attribute instead of the redirect link
    if (allItems.length < 10) {
      const queries = lang === "te"
        ? ["agriculture+India+Telugu"]
        : ["agriculture+farming+India"];
      
      for (const q of queries) {
        try {
          const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang === "te" ? "te" : "en"}-IN&gl=IN&ceid=IN:${lang === "te" ? "te" : "en"}`;
          const resp = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AgriNewsBot/1.0)" },
          });
          if (resp.ok) {
            const xml = await resp.text();
            // Extract with source URL from <source url="..."> attribute
            const gItems: any[] = [];
            const itemRegex = /<item>(.*?)<\/item>/gs;
            let m;
            while ((m = itemRegex.exec(xml)) !== null) {
              const block = m[1];
              const title = block.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
              const sourceMatch = block.match(/<source[^>]*url="([^"]*)"[^>]*>(.*?)<\/source>/s);
              const sourceUrl = sourceMatch?.[1]?.trim() || "";
              const sourceName = sourceMatch?.[2]?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")?.trim() || "";
              const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || "";
              const description = block.match(/<description>(.*?)<\/description>/s)?.[1]
                ?.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
                ?.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
                ?.replace(/<[^>]*>/g, "")?.replace(/&nbsp;/g, " ")?.trim() || "";
              // Use source URL (publisher domain) as the link - better than blocked Google URL
              if (title && sourceUrl) {
                gItems.push({ title, link: sourceUrl, pubDate, description, source: sourceName });
              }
            }
            allItems.push(...gItems);
          }
        } catch (e) {
          console.error("Google RSS fallback error:", e);
        }
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

    // Return top 20
    const news = unique.slice(0, 20).map((item, i) => ({
      id: `news-${i}`,
      title: item.title.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1"),
      description: item.description?.substring(0, 200) || "",
      link: item.link,
      source: (item.source || new URL(item.link).hostname.replace("www.", "")).replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1"),
      published_at: item.pubDate || new Date().toISOString(),
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
