import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";

interface MarketRatesProps {
  onBack: () => void;
}

const sampleRates = [
  { crop: "🌶 మిరప", cropEn: "Chilli", min: 8000, max: 22000, modal: 15000, market: "గుంటూరు" },
  { crop: "🌾 వరి", cropEn: "Rice", min: 1800, max: 2400, modal: 2100, market: "విజయవాడ" },
  { crop: "🥜 వేరుశనగ", cropEn: "Groundnut", min: 5000, max: 7500, modal: 6200, market: "కర్నూలు" },
  { crop: "🧅 ఉల్లిపాయ", cropEn: "Onion", min: 800, max: 2500, modal: 1500, market: "హైదరాబాద్" },
  { crop: "🍅 టమాటో", cropEn: "Tomato", min: 500, max: 3000, modal: 1200, market: "మదనపల్లె" },
  { crop: "🌽 మొక్కజొన్న", cropEn: "Maize", min: 1800, max: 2200, modal: 2000, market: "వరంగల్" },
];

const MarketRates = ({ onBack }: MarketRatesProps) => {
  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">💰</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">మార్కెట్ ధరలు</h2>
        <SpeakButton
          text="ఈ రోజు మార్కెట్ ధరలు. గుంటూరు లో మిరప ధర క్వింటాల్ కు 15 వేల రూపాయలు. విజయవాడ లో వరి ధర 2100 రూపాయలు."
          size="md"
        />
      </div>

      <p className="text-muted-foreground font-telugu mb-4 text-sm">📅 నేటి ధరలు (₹/క్వింటాల్) — డెమో డేటా</p>

      <div className="space-y-3">
        {sampleRates.map((rate) => (
          <div key={rate.cropEn} className="bg-card rounded-2xl p-4 border border-border card-hover">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-lg font-bold font-telugu">{rate.crop}</span>
                <span className="text-xs text-muted-foreground ml-2">({rate.cropEn})</span>
              </div>
              <SpeakButton
                text={`${rate.market} లో ${rate.crop} ధర. కనిష్ట ధర ${rate.min} రూపాయలు. గరిష్ట ధర ${rate.max} రూపాయలు. సాధారణ ధర ${rate.modal} రూపాయలు.`}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-destructive/10 rounded-lg py-2">
                <p className="text-xs text-muted-foreground font-telugu">కనిష్ట</p>
                <p className="text-lg font-bold text-destructive">₹{rate.min.toLocaleString()}</p>
              </div>
              <div className="bg-success/10 rounded-lg py-2">
                <p className="text-xs text-muted-foreground font-telugu">గరిష్ట</p>
                <p className="text-lg font-bold text-success">₹{rate.max.toLocaleString()}</p>
              </div>
              <div className="bg-primary/10 rounded-lg py-2">
                <p className="text-xs text-muted-foreground font-telugu">సాధారణ</p>
                <p className="text-lg font-bold text-primary">₹{rate.modal.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-telugu">📍 {rate.market}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketRates;
