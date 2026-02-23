import { ArrowLeft, Search, FileText, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface GovernmentSchemesProps {
  onBack: () => void;
}

interface Scheme {
  id: string;
  name_en: string;
  name_te: string;
  type: string;
  ministry: string;
  brief_en: string;
  brief_te: string;
  eligibility_en: string;
  eligibility_te: string;
  benefit_en: string;
  benefit_te: string;
  apply_link: string;
  documents_en: string;
  documents_te: string;
  status: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const typeLabels: Record<string, Record<string, string>> = {
  central: { te: "🇮🇳 కేంద్ర ప్రభుత్వం", en: "🇮🇳 Central Govt" },
  ap: { te: "🟡 ఆంధ్రప్రదేశ్", en: "🟡 Andhra Pradesh" },
  ts: { te: "🟠 తెలంగాణ", en: "🟠 Telangana" },
};

const typeFilters = [
  { key: "all", te: "అన్నీ", en: "All" },
  { key: "central", te: "కేంద్రం", en: "Central" },
  { key: "ap", te: "AP", en: "AP" },
  { key: "ts", te: "TS", en: "TS" },
];

const GovernmentSchemes = ({ onBack }: GovernmentSchemesProps) => {
  const { lang, t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useState(() => {
    fetchSchemes("all", "");
  });

  const fetchSchemes = async (type: string, searchTerm: string) => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/govt-schemes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: type === "all" ? undefined : type, search: searchTerm || undefined }),
      });
      if (!resp.ok) throw new Error("Failed");
      const data = await resp.json();
      setSchemes(data.schemes || []);
    } catch {
      setError(lang === "te" ? "పథకాలు లోడ్ కాలేదు" : "Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string) => {
    setFilter(key);
    fetchSchemes(key, search);
  };

  const handleSearch = () => {
    fetchSchemes(filter, search);
  };

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">🏛</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
          {lang === "te" ? "ప్రభుత్వ పథకాలు" : "Government Schemes"}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground font-telugu mb-4">
        {lang === "te" ? "🇮🇳 భారత ప్రభుత్వ వ్యవసాయ పథకాల సమాచారం" : "🇮🇳 Indian Government Agriculture Schemes Information"}
      </p>

      {/* Search */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={lang === "te" ? "పథకం వెతకండి..." : "Search scheme..."}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-border bg-card text-foreground font-telugu focus:outline-none focus:border-primary transition-colors"
          />
          <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {typeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-telugu transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {lang === "te" ? f.te : f.en}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-destructive font-telugu text-center py-8">{error}</p>
      ) : schemes.length === 0 ? (
        <p className="text-center text-muted-foreground font-telugu py-12">
          {lang === "te" ? "పథకాలు కనుగొనబడలేదు" : "No schemes found"}
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-telugu">
            {lang === "te" ? `${schemes.length} పథకాలు` : `${schemes.length} schemes`}
          </p>

          {schemes.map((s) => {
            const expanded = expandedId === s.id;
            return (
              <div
                key={s.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  s.type === "ap"
                    ? "bg-yellow-500/5 border-yellow-500/30"
                    : s.type === "ts"
                    ? "bg-orange-500/5 border-orange-500/30"
                    : "bg-card border-border"
                }`}
              >
                {/* Header */}
                <div className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-telugu">
                          {typeLabels[s.type]?.[lang] || s.type}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-telugu">
                          ✅ {lang === "te" ? "చురుకైన" : "Active"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-telugu">{t(s.name_te, s.name_en)}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.ministry}</p>
                    </div>
                    <SpeakButton
                      text={`${t(s.name_te, s.name_en)}. ${t(s.brief_te, s.brief_en)}`}
                      lang={lang === "te" ? "te-IN" : "en-US"}
                      size="sm"
                    />
                  </div>

                  {/* Brief */}
                  <p className="text-sm font-telugu text-foreground/80 leading-relaxed mt-2">
                    📋 {t(s.brief_te, s.brief_en)}
                  </p>

                  {/* Key info always visible */}
                  <div className="mt-3 space-y-1.5">
                    <p className="text-sm font-telugu">
                      <span className="font-bold">💰 {lang === "te" ? "ప్రయోజనం" : "Benefit"}:</span>{" "}
                      {t(s.benefit_te, s.benefit_en)}
                    </p>
                    <p className="text-sm font-telugu">
                      <span className="font-bold">👤 {lang === "te" ? "అర్హత" : "Eligibility"}:</span>{" "}
                      {t(s.eligibility_te, s.eligibility_en)}
                    </p>
                  </div>
                </div>

                {/* Expand/collapse */}
                <button
                  onClick={() => setExpandedId(expanded ? null : s.id)}
                  className="w-full flex items-center justify-center gap-1 py-2 text-xs text-primary font-telugu hover:bg-primary/5 transition-colors"
                >
                  {expanded
                    ? lang === "te" ? "తక్కువ చూడండి" : "Show less"
                    : lang === "te" ? "మరిన్ని వివరాలు" : "More details"}
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* Expanded details */}
                {expanded && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-sm font-telugu">
                        <span className="font-bold">📄 {lang === "te" ? "అవసరమైన పత్రాలు" : "Documents Required"}:</span>
                      </p>
                      <p className="text-sm font-telugu text-muted-foreground mt-1">
                        {t(s.documents_te, s.documents_en)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {s.apply_link && (
                        <a
                          href={s.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-telugu text-sm font-bold active:scale-95 transition-transform"
                        >
                          <ExternalLink size={16} />
                          {lang === "te" ? "దరఖాస్తు చేయండి" : "Apply Now"}
                        </a>
                      )}
                      <SpeakButton
                        text={`${t(s.name_te, s.name_en)}. ${t(s.brief_te, s.brief_en)}. ${lang === "te" ? "అర్హత" : "Eligibility"}: ${t(s.eligibility_te, s.eligibility_en)}. ${lang === "te" ? "ప్రయోజనం" : "Benefit"}: ${t(s.benefit_te, s.benefit_en)}. ${lang === "te" ? "అవసరమైన పత్రాలు" : "Documents"}: ${t(s.documents_te, s.documents_en)}`}
                        lang={lang === "te" ? "te-IN" : "en-US"}
                        size="md"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default GovernmentSchemes;
