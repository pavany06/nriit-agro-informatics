import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AgriNewsProps {
  onBack: () => void;
}

const AgriNews = ({ onBack }: AgriNewsProps) => {
  const { lang, t } = useLanguage();

  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").eq("active", true).order("created_at", { ascending: false });
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
        <span className="text-4xl">📢</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">{lang === "te" ? "వ్యవసాయ వార్తలు" : "Agri News"}</h2>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3 mb-6">
          {alerts.map((a) => (
            <div key={a.id} className={`p-4 rounded-xl border-2 font-telugu ${
              a.alert_type === "danger" ? "bg-destructive/10 border-destructive/30 text-destructive" :
              a.alert_type === "warning" ? "bg-warning/10 border-warning/30 text-warning-foreground" :
              "bg-primary/10 border-primary/30 text-primary"
            }`}>
              <div className="flex items-center justify-between">
                <span>{a.alert_type === "danger" ? "🚨" : a.alert_type === "warning" ? "⚠️" : "ℹ️"} {t(a.message_te, a.message_en)}</span>
                <SpeakButton text={t(a.message_te, a.message_en)} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !news?.length ? (
        <p className="text-center text-muted-foreground font-telugu py-12">{lang === "te" ? "వార్తలు త్వరలో జోడించబడతాయి" : "News coming soon"}</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl p-5 border border-border card-hover">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">📅 {new Date(item.created_at).toLocaleDateString()}</p>
                  <h3 className="text-lg font-bold font-telugu text-foreground mb-1">{t(item.title_te, item.title_en)}</h3>
                  <p className="text-sm text-muted-foreground font-telugu">{t(item.summary_te, item.summary_en)}</p>
                </div>
                <SpeakButton text={`${t(item.title_te, item.title_en)}. ${t(item.summary_te, item.summary_en)}`} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AgriNews;
