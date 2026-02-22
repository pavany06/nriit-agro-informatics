import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface MarketRatesProps {
  onBack: () => void;
}

const sampleRates = [
  { crop_te: "🌶 మిరప", crop_en: "🌶 Chilli", min: 8000, max: 22000, modal: 15000, market_te: "గుంటూరు", market_en: "Guntur" },
  { crop_te: "🌾 వరి", crop_en: "🌾 Rice", min: 1800, max: 2400, modal: 2100, market_te: "విజయవాడ", market_en: "Vijayawada" },
  { crop_te: "🥜 వేరుశనగ", crop_en: "🥜 Groundnut", min: 5000, max: 7500, modal: 6200, market_te: "కర్నూలు", market_en: "Kurnool" },
  { crop_te: "🧅 ఉల్లిపాయ", crop_en: "🧅 Onion", min: 800, max: 2500, modal: 1500, market_te: "హైదరాబాద్", market_en: "Hyderabad" },
  { crop_te: "🍅 టమాటో", crop_en: "🍅 Tomato", min: 500, max: 3000, modal: 1200, market_te: "మదనపల్లె", market_en: "Madanapalle" },
  { crop_te: "🌽 మొక్కజొన్న", crop_en: "🌽 Maize", min: 1800, max: 2200, modal: 2000, market_te: "వరంగల్", market_en: "Warangal" },
];

const MarketRates = ({ onBack }: MarketRatesProps) => {
  const { lang, t } = useLanguage();

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">💰</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">{lang === "te" ? "మార్కెట్ ధరలు" : "Market Rates"}</h2>
        <SpeakButton
          text={lang === "te"
            ? "ఈ రోజు మార్కెట్ ధరలు. గుంటూరు లో మిరప ధర క్వింటాల్ కు 15 వేల రూపాయలు."
            : "Today's market rates. Chilli price in Guntur is 15,000 rupees per quintal."}
          lang={lang === "te" ? "te-IN" : "en-US"} size="md"
        />
      </div>
      <p className="text-muted-foreground font-telugu mb-4 text-sm">
        📅 {lang === "te" ? "నేటి ధరలు (₹/క్వింటాల్) — డెమో డేటా" : "Today's rates (₹/quintal) — Demo data"}
      </p>
      <div className="space-y-3">
        {sampleRates.map((rate, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border border-border card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold font-telugu">{t(rate.crop_te, rate.crop_en)}</span>
              <SpeakButton
                text={lang === "te"
                  ? `${rate.market_te} లో ${rate.crop_te} ధర. కనిష్ట ${rate.min}, గరిష్ట ${rate.max}, సాధారణ ${rate.modal} రూపాయలు.`
                  : `${rate.crop_en} price in ${rate.market_en}. Min ${rate.min}, Max ${rate.max}, Modal ${rate.modal} rupees.`}
                lang={lang === "te" ? "te-IN" : "en-US"} size="sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-destructive/10 rounded-lg py-2">
                <p className="text-xs text-muted-foreground font-telugu">{lang === "te" ? "కనిష్ట" : "Min"}</p>
                <p className="text-lg font-bold text-destructive">₹{rate.min.toLocaleString()}</p>
              </div>
              <div className="bg-success/10 rounded-lg py-2">
                <p className="text-xs text-muted-foreground font-telugu">{lang === "te" ? "గరిష్ట" : "Max"}</p>
                <p className="text-lg font-bold text-success">₹{rate.max.toLocaleString()}</p>
              </div>
              <div className="bg-primary/10 rounded-lg py-2">
                <p className="text-xs text-muted-foreground font-telugu">{lang === "te" ? "సాధారణ" : "Modal"}</p>
                <p className="text-lg font-bold text-primary">₹{rate.modal.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-telugu">📍 {t(rate.market_te, rate.market_en)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketRates;
