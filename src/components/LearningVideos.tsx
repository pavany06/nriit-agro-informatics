import { ArrowLeft } from "lucide-react";

interface LearningVideosProps {
  onBack: () => void;
}

const videos = [
  { title: "డ్రోన్ వ్యవసాయం", titleEn: "Drone Farming", videoId: "dQw4w9WgXcQ", emoji: "🚁" },
  { title: "సేంద్రియ వ్యవసాయం", titleEn: "Organic Farming", videoId: "dQw4w9WgXcQ", emoji: "🌿" },
  { title: "నీటి నిర్వహణ", titleEn: "Water Management", videoId: "dQw4w9WgXcQ", emoji: "💧" },
  { title: "చీడపీడల నివారణ", titleEn: "Pest Control", videoId: "dQw4w9WgXcQ", emoji: "🐛" },
  { title: "పాలీహౌస్ సాగు", titleEn: "Polyhouse Farming", videoId: "dQw4w9WgXcQ", emoji: "🏠" },
  { title: "వర్మి కంపోస్ట్", titleEn: "Vermicompost", videoId: "dQw4w9WgXcQ", emoji: "🪱" },
];

const LearningVideos = ({ onBack }: LearningVideosProps) => {
  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🎥</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">నేర్చుకోండి</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((v, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
            <div className="relative bg-muted aspect-video flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl block mb-2">{v.emoji}</span>
                <p className="text-sm text-muted-foreground font-telugu">▶ వీడియో చూడండి</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold font-telugu">{v.title}</h3>
              <p className="text-xs text-muted-foreground">{v.titleEn}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6 font-telugu">
        🎬 డెమో — అసలు YouTube వీడియోలు త్వరలో జోడించబడతాయి
      </p>
    </section>
  );
};

export default LearningVideos;
