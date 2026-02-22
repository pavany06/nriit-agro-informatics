import { CloudSun, Leaf, Mic, IndianRupee, Landmark, Newspaper, Globe, PlayCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureGridProps {
  onSectionClick: (section: string) => void;
}

const features = [
  { id: "weather", label_te: "వాతావరణం", label_en: "Weather", emoji: "🌦", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { id: "disease", label_te: "పంట రోగాలు", label_en: "Crop Disease", emoji: "🌱", color: "bg-green-600/10 text-green-700 border-green-200" },
  { id: "voice", label_te: "AI సహాయకుడు", label_en: "Voice AI", emoji: "🎤", color: "bg-accent/10 text-accent border-accent/20" },
  { id: "market", label_te: "మార్కెట్ ధరలు", label_en: "Market Rates", emoji: "💰", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
  { id: "schemes", label_te: "ప్రభుత్వ పథకాలు", label_en: "Govt Schemes", emoji: "🏛", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  { id: "news", label_te: "వ్యవసాయ వార్తలు", label_en: "Agri News", emoji: "📢", color: "bg-red-500/10 text-red-600 border-red-200" },
  { id: "methods", label_te: "ఆధునిక పద్ధతులు", label_en: "Modern Methods", emoji: "🌍", color: "bg-teal-500/10 text-teal-700 border-teal-200" },
  { id: "videos", label_te: "నేర్చుకోండి", label_en: "Learn Videos", emoji: "🎥", color: "bg-primary/10 text-primary border-primary/20" },
];

const FeatureGrid = ({ onSectionClick }: FeatureGridProps) => {
  const { lang, t } = useLanguage();

  return (
    <section className="px-4 py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-telugu text-center">
        🌾 {lang === "te" ? "సేవలు ఎంచుకోండి" : "Choose a Service"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => onSectionClick(f.id)}
            className={`flex flex-col items-center justify-center gap-2 p-5 sm:p-6 rounded-2xl border-2 card-hover cursor-pointer min-h-[100px] ${f.color} active:scale-95 transition-transform`}
          >
            <span className="text-3xl sm:text-4xl">{f.emoji}</span>
            <span className="text-base sm:text-lg font-bold font-telugu leading-tight text-center">
              {t(f.label_te, f.label_en)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
