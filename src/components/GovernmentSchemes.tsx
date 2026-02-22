import { ArrowLeft, ExternalLink } from "lucide-react";
import SpeakButton from "./SpeakButton";

interface GovernmentSchemesProps {
  onBack: () => void;
}

const schemes = [
  {
    name: "పీఎం కిసాన్ సమ్మాన్ నిధి",
    nameEn: "PM-KISAN",
    eligibility: "అన్ని చిన్న, సన్నకారు రైతులు",
    benefit: "సంవత్సరానికి ₹6,000 (₹2,000 × 3 వాయిదాలు)",
    link: "https://pmkisan.gov.in",
    type: "central",
  },
  {
    name: "వైఎస్‌ఆర్ రైతు భరోసా",
    nameEn: "YSR Rythu Bharosa (AP)",
    eligibility: "ఆంధ్రప్రదేశ్ రైతులు",
    benefit: "సంవత్సరానికి ₹13,500 పెట్టుబడి సహాయం",
    link: "https://ysrrythubharosa.ap.gov.in",
    type: "ap",
  },
  {
    name: "రైతు బంధు",
    nameEn: "Rythu Bandhu (Telangana)",
    eligibility: "తెలంగాణ భూ యజమానులు",
    benefit: "ఎకరాకు ₹10,000 సీజన్ కు",
    link: "https://rythubandhu.telangana.gov.in",
    type: "ts",
  },
  {
    name: "ప్రధానమంత్రి ఫసల్ బీమా యోజన",
    nameEn: "PM Fasal Bima Yojana",
    eligibility: "పంట రుణం తీసుకున్న రైతులు",
    benefit: "ప్రకృతి విపత్తులలో పంట నష్టపరిహారం",
    link: "https://pmfby.gov.in",
    type: "central",
  },
  {
    name: "కిసాన్ క్రెడిట్ కార్డ్",
    nameEn: "Kisan Credit Card",
    eligibility: "అన్ని రైతులు",
    benefit: "తక్కువ వడ్డీకి పంట రుణం (4% వడ్డీ)",
    link: "#",
    type: "central",
  },
];

const typeLabels: Record<string, string> = {
  central: "🇮🇳 కేంద్ర ప్రభుత్వం",
  ap: "🟡 ఆంధ్రప్రదేశ్",
  ts: "🟠 తెలంగాణ",
};

const GovernmentSchemes = ({ onBack }: GovernmentSchemesProps) => {
  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🏛</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">ప్రభుత్వ పథకాలు</h2>
      </div>

      <div className="space-y-4">
        {schemes.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border card-hover">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-telugu">
                  {typeLabels[s.type]}
                </span>
                <h3 className="text-lg font-bold font-telugu mt-2">{s.name}</h3>
                <p className="text-xs text-muted-foreground">{s.nameEn}</p>
              </div>
              <SpeakButton
                text={`${s.name}. అర్హత: ${s.eligibility}. ప్రయోజనం: ${s.benefit}`}
                size="sm"
              />
            </div>
            <div className="space-y-1 mt-3">
              <p className="text-sm font-telugu"><span className="font-bold">👤 అర్హత:</span> {s.eligibility}</p>
              <p className="text-sm font-telugu"><span className="font-bold">💰 ప్రయోజనం:</span> {s.benefit}</p>
            </div>
            {s.link !== "#" && (
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-accent font-bold font-telugu active:opacity-70"
              >
                దరఖాస్తు చేయండి <ExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GovernmentSchemes;
