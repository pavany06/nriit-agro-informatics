import { ArrowLeft, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

interface AgriNewsProps {
  onBack: () => void;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  published_at: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const AgriNews = ({ onBack }: AgriNewsProps) => {
  const { lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/agri-news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang }),
      });
      if (!resp.ok) throw new Error("Failed");
      const data = await resp.json();
      setNews(data.news || []);
    } catch {
      setError(lang === "te" ? "వార్తలు లోడ్ కాలేదు" : "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [lang]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return lang === "te" ? `${mins} నిమిషాల క్రితం` : `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return lang === "te" ? `${hrs} గంటల క్రితం` : `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return lang === "te" ? `${days} రోజుల క్రితం` : `${days}d ago`;
  };

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📰</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
            {lang === "te" ? "వ్యవసాయ వార్తలు" : "Agri News"}
          </h2>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground font-telugu mb-4">
        {lang === "te" ? "🔴 రియల్-టైమ్ వ్యవసాయ వార్తల ఫీడ్" : "🔴 Real-time agriculture news feed"}
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-destructive font-telugu mb-3">{error}</p>
          <button onClick={fetchNews} className="text-primary font-telugu text-sm underline">
            {lang === "te" ? "మళ్ళీ ప్రయత్నించండి" : "Try again"}
          </button>
        </div>
      ) : news.length === 0 ? (
        <p className="text-center text-muted-foreground font-telugu py-12">
          {lang === "te" ? "వార్తలు అందుబాటులో లేవు" : "No news available"}
        </p>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold font-telugu text-foreground leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground font-telugu mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {item.source && (
                      <span className="px-2 py-0.5 rounded-full bg-muted font-medium truncate max-w-[140px]">
                        {item.source}
                      </span>
                    )}
                    <span>⏱ {timeAgo(item.published_at)}</span>
                    <ExternalLink size={12} className="text-primary ml-auto flex-shrink-0" />
                  </div>
                </div>
                <div className="flex-shrink-0 ml-1" onClick={(e) => e.preventDefault()}>
                  <SpeakButton
                    text={item.title}
                    lang={lang === "te" ? "te-IN" : "en-US"}
                    size="sm"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default AgriNews;
