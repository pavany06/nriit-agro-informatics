import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FarmingMethodsProps {
  onBack: () => void;
}

const FarmingMethods = ({ onBack }: FarmingMethodsProps) => {
  const { lang, t } = useLanguage();

  const { data: methods, isLoading } = useQuery({
    queryKey: ["farming_methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("farming_methods").select("*").eq("published", true).order("created_at", { ascending: false });
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
        <span className="text-4xl">🌍</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">{lang === "te" ? "ఆధునిక వ్యవసాయ పద్ధతులు" : "Modern Farming Methods"}</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !methods?.length ? (
        <p className="text-center text-muted-foreground font-telugu py-12">{lang === "te" ? "పద్ధతులు త్వరలో జోడించబడతాయి" : "Methods coming soon"}</p>
      ) : (
        <div className="space-y-4">
          {methods.map((m) => (
            <div key={m.id} className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
              {m.image_url && <img src={m.image_url} alt={m.name_en || ""} className="w-full h-40 object-cover" loading="lazy" />}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold font-telugu">{m.emoji} {t(m.name_te, m.name_en)}</h3>
                  </div>
                  <SpeakButton text={`${t(m.name_te, m.name_en)}. ${t(m.description_te, m.description_en)}`} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground font-telugu">{t(m.description_te, m.description_en)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FarmingMethods;
