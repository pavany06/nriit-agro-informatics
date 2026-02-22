import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GovernmentSchemesProps {
  onBack: () => void;
}

const typeLabels: Record<string, Record<string, string>> = {
  central: { te: "🇮🇳 కేంద్ర ప్రభుత్వం", en: "🇮🇳 Central Govt" },
  ap: { te: "🟡 ఆంధ్రప్రదేశ్", en: "🟡 Andhra Pradesh" },
  ts: { te: "🟠 తెలంగాణ", en: "🟠 Telangana" },
};

const GovernmentSchemes = ({ onBack }: GovernmentSchemesProps) => {
  const { lang, t } = useLanguage();

  const { data: schemes, isLoading } = useQuery({
    queryKey: ["schemes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schemes").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🏛</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">{lang === "te" ? "ప్రభుత్వ పథకాలు" : "Government Schemes"}</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !schemes?.length ? (
        <p className="text-center text-muted-foreground font-telugu py-12">{lang === "te" ? "పథకాలు త్వరలో జోడించబడతాయి" : "Schemes coming soon"}</p>
      ) : (
        <div className="space-y-4">
          {schemes.map((s) => (
            <div key={s.id} className="bg-card rounded-2xl p-5 border border-border card-hover">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-telugu">
                    {typeLabels[s.scheme_type]?.[lang] || s.scheme_type}
                  </span>
                  <h3 className="text-lg font-bold font-telugu mt-2">{t(s.name_te, s.name_en)}</h3>
                </div>
                <SpeakButton text={`${t(s.name_te, s.name_en)}. ${t(s.eligibility_te, s.eligibility_en)}. ${t(s.benefit_te, s.benefit_en)}`} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
              </div>
              <div className="space-y-1 mt-3">
                <p className="text-sm font-telugu"><span className="font-bold">👤 {lang === "te" ? "అర్హత" : "Eligibility"}:</span> {t(s.eligibility_te, s.eligibility_en)}</p>
                <p className="text-sm font-telugu"><span className="font-bold">💰 {lang === "te" ? "ప్రయోజనం" : "Benefit"}:</span> {t(s.benefit_te, s.benefit_en)}</p>
              </div>
              {s.apply_link && (
                <a href={s.apply_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm text-accent font-bold font-telugu">
                  {lang === "te" ? "దరఖాస్తు చేయండి ↗" : "Apply Now ↗"}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GovernmentSchemes;
