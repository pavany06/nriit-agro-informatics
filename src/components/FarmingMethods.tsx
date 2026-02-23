import { useState, useEffect } from "react";
import { ArrowLeft, Search, ChevronDown, ChevronUp, Play } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface FarmingMethodsProps {
  onBack: () => void;
}

const categories = [
  { key: "all", labelEn: "All", labelTe: "అన్నీ", emoji: "📋" },
  { key: "organic", labelEn: "Organic", labelTe: "సేంద్రీయ", emoji: "🌿" },
  { key: "irrigation", labelEn: "Irrigation", labelTe: "నీటిపారుదల", emoji: "💧" },
  { key: "soil", labelEn: "Soil", labelTe: "నేల", emoji: "🪨" },
  { key: "technology", labelEn: "Technology", labelTe: "సాంకేతికం", emoji: "🤖" },
  { key: "pest_management", labelEn: "Pest Mgmt", labelTe: "తెగులు నిర్వహణ", emoji: "🐛" },
];

const difficultyConfig: Record<string, { labelEn: string; labelTe: string; color: string }> = {
  easy: { labelEn: "Easy", labelTe: "సులభం", color: "bg-green-500/15 text-green-700 dark:text-green-400" },
  medium: { labelEn: "Medium", labelTe: "మధ్యస్థం", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  advanced: { labelEn: "Advanced", labelTe: "అధునాతన", color: "bg-red-500/15 text-red-700 dark:text-red-400" },
};

const FarmingMethods = ({ onBack }: FarmingMethodsProps) => {
  const { lang, t } = useLanguage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: methods, isLoading } = useQuery({
    queryKey: ["farming_methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("farming_methods")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("farming-methods-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "farming_methods" }, () => {
        queryClient.invalidateQueries({ queryKey: ["farming_methods"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const filtered = methods?.filter((m: any) => {
    const matchesCategory = category === "all" || m.category === category;
    const matchesSearch =
      !search ||
      (m.name_en || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.name_te || "").includes(search) ||
      (m.description_en || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getYouTubeId = (url: string) => {
    const match = url?.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || url;
  };

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">🌍</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
          {lang === "te" ? "ఆధునిక వ్యవసాయ పద్ధతులు" : "Modern Farming Methods"}
        </h2>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "te" ? "పద్ధతులను వెతకండి..." : "Search methods..."}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground font-telugu outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold font-telugu whitespace-nowrap transition-all active:scale-95 ${
              category === c.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {c.emoji} {lang === "te" ? c.labelTe : c.labelEn}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !filtered?.length ? (
        <p className="text-center text-muted-foreground font-telugu py-12">
          {lang === "te" ? "పద్ధతులు కనుగొనబడలేదు" : "No methods found"}
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((m: any) => {
            const isExpanded = expandedId === m.id;
            const diff = difficultyConfig[m.difficulty] || difficultyConfig.easy;

            return (
              <div key={m.id} className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
                {m.image_url && (
                  <img src={m.image_url} alt={m.name_en || ""} className="w-full h-44 object-cover" loading="lazy" />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-xl font-bold font-telugu">
                          {m.emoji} {t(m.name_te, m.name_en)}
                        </h3>
                        <Badge variant="secondary" className={`text-xs font-bold ${diff.color}`}>
                          {lang === "te" ? diff.labelTe : diff.labelEn}
                        </Badge>
                      </div>
                      {m.category && (
                        <span className="text-xs text-muted-foreground font-telugu">
                          {categories.find((c) => c.key === m.category)?.emoji}{" "}
                          {lang === "te"
                            ? categories.find((c) => c.key === m.category)?.labelTe
                            : categories.find((c) => c.key === m.category)?.labelEn}
                        </span>
                      )}
                    </div>
                    <SpeakButton
                      text={`${t(m.name_te, m.name_en)}. ${t(m.description_te, m.description_en)}`}
                      lang={lang === "te" ? "te-IN" : "en-US"}
                      size="sm"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground font-telugu mb-3">
                    {t(m.description_te, m.description_en)}
                  </p>

                  {/* Expand/Collapse */}
                  {(m.steps_en || m.benefits_en || m.suitable_crops_en || m.video_url) && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      className="flex items-center gap-1 text-primary text-sm font-bold font-telugu active:scale-95 transition-transform"
                    >
                      {isExpanded
                        ? lang === "te" ? "తక్కువ చూపు" : "Show Less"
                        : lang === "te" ? "మరింత చూడండి" : "View Details"}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}

                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      {/* Steps */}
                      {t(m.steps_te, m.steps_en) && (
                        <div>
                          <h4 className="font-bold text-foreground font-telugu mb-1">
                            📝 {lang === "te" ? "దశలు" : "Steps"}
                          </h4>
                          <p className="text-sm text-muted-foreground font-telugu whitespace-pre-line">
                            {t(m.steps_te, m.steps_en)}
                          </p>
                        </div>
                      )}

                      {/* Benefits */}
                      {t(m.benefits_te, m.benefits_en) && (
                        <div>
                          <h4 className="font-bold text-foreground font-telugu mb-1">
                            ✅ {lang === "te" ? "ప్రయోజనాలు" : "Benefits"}
                          </h4>
                          <p className="text-sm text-muted-foreground font-telugu whitespace-pre-line">
                            {t(m.benefits_te, m.benefits_en)}
                          </p>
                        </div>
                      )}

                      {/* Suitable Crops */}
                      {t(m.suitable_crops_te, m.suitable_crops_en) && (
                        <div>
                          <h4 className="font-bold text-foreground font-telugu mb-1">
                            🌾 {lang === "te" ? "తగిన పంటలు" : "Suitable Crops"}
                          </h4>
                          <p className="text-sm text-muted-foreground font-telugu whitespace-pre-line">
                            {t(m.suitable_crops_te, m.suitable_crops_en)}
                          </p>
                        </div>
                      )}

                      {/* YouTube Video */}
                      {m.video_url && (
                        <div>
                          <h4 className="font-bold text-foreground font-telugu mb-2">
                            <Play size={16} className="inline mr-1" />
                            {lang === "te" ? "వీడియో" : "Video"}
                          </h4>
                          <div className="aspect-video rounded-xl overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(m.video_url)}`}
                              title={m.name_en}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FarmingMethods;
