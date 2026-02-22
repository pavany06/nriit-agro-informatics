import {
  CloudSun,
  Leaf,
  Mic,
  IndianRupee,
  Landmark,
  Newspaper,
  Globe,
  PlayCircle,
} from "lucide-react";

interface FeatureGridProps {
  onSectionClick: (section: string) => void;
}

const features = [
  { id: "weather", icon: CloudSun, label: "వాతావరణం", labelEn: "Weather", emoji: "🌦", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { id: "disease", icon: Leaf, label: "పంట రోగాలు", labelEn: "Crop Disease", emoji: "🌱", color: "bg-green-600/10 text-green-700 border-green-200" },
  { id: "voice", icon: Mic, label: "AI సహాయకుడు", labelEn: "Voice AI", emoji: "🎤", color: "bg-accent/10 text-accent border-accent/20" },
  { id: "market", icon: IndianRupee, label: "మార్కెట్ ధరలు", labelEn: "Market Rates", emoji: "💰", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
  { id: "schemes", icon: Landmark, label: "ప్రభుత్వ పథకాలు", labelEn: "Govt Schemes", emoji: "🏛", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  { id: "news", icon: Newspaper, label: "వ్యవసాయ వార్తలు", labelEn: "Agri News", emoji: "📢", color: "bg-red-500/10 text-red-600 border-red-200" },
  { id: "methods", icon: Globe, label: "ఆధునిక పద్ధతులు", labelEn: "Modern Methods", emoji: "🌍", color: "bg-teal-500/10 text-teal-700 border-teal-200" },
  { id: "videos", icon: PlayCircle, label: "నేర్చుకోండి", labelEn: "Learn Videos", emoji: "🎥", color: "bg-primary/10 text-primary border-primary/20" },
];

const FeatureGrid = ({ onSectionClick }: FeatureGridProps) => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-telugu text-center">
        🌾 సేవలు ఎంచుకోండి
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
              {f.label}
            </span>
            <span className="text-xs opacity-60">{f.labelEn}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
