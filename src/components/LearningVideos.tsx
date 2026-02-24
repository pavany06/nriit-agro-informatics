import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LearningVideosProps {
  onBack: () => void;
}

const LearningVideos = ({ onBack }: LearningVideosProps) => {
  const { lang, t } = useLanguage();

  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("videos").select("*").eq("published", true).order("created_at", { ascending: false });
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
        <span className="text-4xl">🎥</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">{lang === "te" ? "నేర్చుకోండి" : "Learn"}</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !videos?.length ? (
        <p className="text-center text-muted-foreground font-telugu py-12">{lang === "te" ? "వీడియోలు త్వరలో జోడించబడతాయి" : "Videos coming soon"}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${v.youtube_id}`}
                  title={v.title_en || ""}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold font-telugu flex-1">{v.emoji} {t(v.title_te, v.title_en)}</h3>
                <SpeakButton text={t(v.title_te, v.title_en)} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LearningVideos;
