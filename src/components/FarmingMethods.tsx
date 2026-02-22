import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";

interface FarmingMethodsProps {
  onBack: () => void;
}

const methods = [
  {
    emoji: "💧",
    name: "బిందు సేద్యం",
    nameEn: "Drip Irrigation",
    description: "నీటిని నేరుగా మొక్కల వేళ్లకు అందించే పద్ధతి. 60% నీరు ఆదా అవుతుంది.",
    image: "https://images.unsplash.com/photo-1621460248083-6271cc4437a8?w=400&h=250&fit=crop",
  },
  {
    emoji: "🌿",
    name: "హైడ్రోపోనిక్స్",
    nameEn: "Hydroponics",
    description: "మట్టి లేకుండా నీటిలో పంటలు పెంచే ఆధునిక పద్ధతి. అధిక దిగుబడి.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop",
  },
  {
    emoji: "🏢",
    name: "నిలువు వ్యవసాయం",
    nameEn: "Vertical Farming",
    description: "అంతస్తుల్లో పంటలు పెంచే పద్ధతి. తక్కువ స్థలంలో ఎక్కువ దిగుబడి.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=250&fit=crop",
  },
  {
    emoji: "🎯",
    name: "ఖచ్చితమైన వ్యవసాయం",
    nameEn: "Precision Agriculture",
    description: "సెన్సర్లు, GPS ద్వారా పంట పరిస్థితి గమనించి సరైన సమయంలో సరైన చర్య తీసుకోవడం.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop",
  },
  {
    emoji: "🚁",
    name: "డ్రోన్ పిచికారీ",
    nameEn: "Drone Spraying",
    description: "డ్రోన్ ద్వారా పురుగు మందులు, ఎరువులు చల్లడం. వేగం, ఖర్చు తక్కువ.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=250&fit=crop",
  },
];

const FarmingMethods = ({ onBack }: FarmingMethodsProps) => {
  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🌍</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">ఆధునిక వ్యవసాయ పద్ధతులు</h2>
      </div>

      <div className="space-y-4">
        {methods.map((m, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
            <img
              src={m.image}
              alt={m.nameEn}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold font-telugu">
                    {m.emoji} {m.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{m.nameEn}</p>
                </div>
                <SpeakButton text={`${m.name}. ${m.description}`} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground font-telugu">{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FarmingMethods;
