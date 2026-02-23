const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// YouTube RSS search queries for Telugu farming content
const SEARCH_QUERIES = [
  "Telugu+farming+technology+2025",
  "తెలుగు+వ్యవసాయం+టెక్నాలజీ",
  "Telugu+drone+agriculture",
  "Andhra+Pradesh+modern+farming",
  "Telugu+organic+farming+latest",
  "Telugu+polyhouse+hydroponics",
  "annadata+ETV+Telugu+farming",
  "matti+manishi+10TV+agriculture",
  "Tone+Agri+Telugu+farming",
];

// Known working Telugu farming YouTube channel RSS feeds (using playlist uploads)
const CHANNEL_FEEDS = [
  // ETV Annadata - major Telugu farming show
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLLsvKnELVi4POMqRlVFZLwE3rT8jFdBkr",
  // 10TV Matti Manishi playlist
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLtWqALkqlCS8D3hPGdSKC3QpKf_qcxpjn",
];

function extractEmoji(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("drone") || lower.includes("డ్రోన్")) return "🚁";
  if (lower.includes("organic") || lower.includes("సేంద్రియ")) return "🌿";
  if (lower.includes("tractor") || lower.includes("ట్రాక్టర్")) return "🚜";
  if (lower.includes("paddy") || lower.includes("వరి")) return "🌾";
  if (lower.includes("hydropon") || lower.includes("హైడ్రో")) return "💧";
  if (lower.includes("technology") || lower.includes("టెక్నాలజీ")) return "📡";
  if (lower.includes("soil") || lower.includes("మట్టి")) return "🏔️";
  if (lower.includes("irrigation") || lower.includes("నీటి")) return "💦";
  if (lower.includes("dairy") || lower.includes("పశువు")) return "🐄";
  if (lower.includes("polyhouse") || lower.includes("పాలీహౌస్")) return "🏠";
  if (lower.includes("fish") || lower.includes("చేప")) return "🐟";
  if (lower.includes("cotton") || lower.includes("పత్తి")) return "👕";
  if (lower.includes("chilli") || lower.includes("మిరప")) return "🌶️";
  if (lower.includes("annadata") || lower.includes("అన్నదాత")) return "📺";
  return "🎥";
}

async function fetchRSSFeed(
  url: string
): Promise<{ youtube_id: string; title: string }[]> {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AgriBot/1.0)",
      },
    });
    if (!resp.ok) {
      console.error(`Feed fetch failed ${url}: ${resp.status}`);
      return [];
    }
    const xml = await resp.text();
    const entries: { youtube_id: string; title: string }[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      if (videoIdMatch && titleMatch) {
        const title = titleMatch[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        entries.push({ youtube_id: videoIdMatch[1], title });
      }
    }
    return entries;
  } catch (err) {
    console.error(`RSS fetch error:`, err);
    return [];
  }
}

async function searchYouTubeRSS(
  query: string
): Promise<{ youtube_id: string; title: string }[]> {
  // Use YouTube's search results page and extract video IDs
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAISBAgCEAE`; // filter: this week, videos only
    const resp = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "te,en;q=0.9",
      },
    });
    if (!resp.ok) {
      console.error(`Search failed for ${query}: ${resp.status}`);
      return [];
    }
    const html = await resp.text();

    // Extract video data from ytInitialData
    const dataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!dataMatch) {
      console.log(`No ytInitialData found for query: ${query}`);
      return [];
    }

    const results: { youtube_id: string; title: string }[] = [];
    // Extract videoId and title pairs from the JSON
    const videoRegex =
      /"videoId":"([a-zA-Z0-9_-]{11})".*?"text":"((?:[^"\\]|\\.)*)"/g;
    let vMatch;
    const seenIds = new Set<string>();
    while ((vMatch = videoRegex.exec(dataMatch[1])) !== null) {
      const videoId = vMatch[1];
      const title = vMatch[2]
        .replace(/\\u0026/g, "&")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
      if (!seenIds.has(videoId) && title.length > 5) {
        seenIds.add(videoId);
        results.push({ youtube_id: videoId, title });
        if (results.length >= 5) break; // top 5 per query
      }
    }
    return results;
  } catch (err) {
    console.error(`Search error for ${query}:`, err);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch existing youtube_ids to avoid duplicates
    const existingResp = await fetch(
      `${supabaseUrl}/rest/v1/videos?select=youtube_id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    const existingVideos = await existingResp.json();
    const existingIds = new Set(
      (existingVideos || []).map((v: any) => v.youtube_id)
    );

    console.log(`Existing videos: ${existingIds.size}`);

    // Fetch from search queries and RSS feeds in parallel
    const searchPromises = SEARCH_QUERIES.map((q) => searchYouTubeRSS(q));
    const feedPromises = CHANNEL_FEEDS.map((url) => fetchRSSFeed(url));

    const allResults = await Promise.all([...searchPromises, ...feedPromises]);

    const newVideos: any[] = [];
    for (const videoList of allResults) {
      for (const video of videoList) {
        if (existingIds.has(video.youtube_id)) continue;
        newVideos.push({
          youtube_id: video.youtube_id,
          title_en: video.title,
          emoji: extractEmoji(video.title),
          published: true,
        });
        existingIds.add(video.youtube_id);
      }
    }

    let inserted = 0;
    if (newVideos.length > 0) {
      // Limit to 20 newest videos per run to avoid spam
      const toInsert = newVideos.slice(0, 20);
      const insertResp = await fetch(`${supabaseUrl}/rest/v1/videos`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(toInsert),
      });
      if (insertResp.ok) {
        inserted = toInsert.length;
      } else {
        const errText = await insertResp.text();
        console.error("Insert error:", errText);
      }
    }

    console.log(`YouTube auto-fetch complete: ${inserted} new videos added`);

    return new Response(
      JSON.stringify({
        success: true,
        new_videos: inserted,
        total_found: newVideos.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("YouTube fetch error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
