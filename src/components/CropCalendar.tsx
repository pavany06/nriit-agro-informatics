import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "./SpeakButton";

interface CropCalendarProps {
  onBack: () => void;
}

const crops = [
  {
    id: "rice", name_en: "Rice (Paddy)", name_te: "వరి (ధాన్యం)", region: "Both", emoji: "🌾",
    months: { sow: [5, 6, 7], grow: [7, 8, 9, 10], harvest: [10, 11, 12] },
    info_en: "Kharif: Sow Jun-Jul, Transplant Jul-Aug, Harvest Nov-Dec. Rabi: Sow Nov-Dec, Harvest Mar-Apr.",
    info_te: "ఖరీఫ్: జూన్-జూలైలో విత్తనాలు, జూలై-ఆగస్టులో నాట్లు, నవంబర్-డిసెంబర్‌లో కోత. రబీ: నవంబర్-డిసెంబర్‌లో విత్తనాలు, మార్చి-ఏప్రిల్‌లో కోత."
  },
  {
    id: "cotton", name_en: "Cotton", name_te: "పత్తి", region: "Both", emoji: "🏵️",
    months: { sow: [5, 6], grow: [7, 8, 9, 10], harvest: [11, 12, 1] },
    info_en: "Sow in June-July after first rains. Picking starts November onwards. Needs well-drained black soil.",
    info_te: "మొదటి వర్షాల తర్వాత జూన్-జూలైలో విత్తండి. నవంబర్ నుండి కోత ప్రారంభం. నల్ల రేగడి నేల అవసరం."
  },
  {
    id: "chilli", name_en: "Chilli", name_te: "మిర్చి", region: "AP", emoji: "🌶️",
    months: { sow: [6, 7, 8], grow: [8, 9, 10, 11], harvest: [12, 1, 2, 3] },
    info_en: "Nursery in June-July. Transplant after 40 days. Guntur district is famous. Harvest Dec-Mar.",
    info_te: "జూన్-జూలైలో నర్సరీ. 40 రోజుల తర్వాత నాట్లు. గుంటూరు జిల్లా ప్రసిద్ధి. డిసెంబర్-మార్చి కోత."
  },
  {
    id: "groundnut", name_en: "Groundnut", name_te: "వేరుశెనగ", region: "AP", emoji: "🥜",
    months: { sow: [6, 7], grow: [7, 8, 9, 10], harvest: [10, 11] },
    info_en: "Kharif crop. Sow June-July. Harvest in 100-120 days. Anantapur is major growing district.",
    info_te: "ఖరీఫ్ పంట. జూన్-జూలైలో విత్తండి. 100-120 రోజుల్లో కోత. అనంతపురం ప్రధాన జిల్లా."
  },
  {
    id: "sugarcane", name_en: "Sugarcane", name_te: "చెరకు", region: "Both", emoji: "🎋",
    months: { sow: [1, 2, 3], grow: [4, 5, 6, 7, 8, 9, 10], harvest: [11, 12, 1, 2] },
    info_en: "Plant Jan-Mar. Takes 10-12 months to mature. Needs heavy irrigation. Harvest Nov-Feb.",
    info_te: "జనవరి-మార్చిలో నాటండి. 10-12 నెలల్లో పరిపక్వం. భారీ నీటిపారుదల అవసరం. నవంబర్-ఫిబ్రవరి కోత."
  },
  {
    id: "maize", name_en: "Maize (Corn)", name_te: "మొక్కజొన్న", region: "Both", emoji: "🌽",
    months: { sow: [6, 7], grow: [7, 8, 9], harvest: [9, 10] },
    info_en: "Kharif: Sow Jun-Jul, Harvest Sep-Oct. Rabi: Sow Oct-Nov, Harvest Feb-Mar. Short duration crop.",
    info_te: "ఖరీఫ్: జూన్-జూలైలో విత్తండి, సెప్టెంబర్-అక్టోబర్‌లో కోత. రబీ: అక్టోబర్-నవంబర్‌లో విత్తండి."
  },
  {
    id: "turmeric", name_en: "Turmeric", name_te: "పసుపు", region: "Telangana", emoji: "🟡",
    months: { sow: [5, 6], grow: [7, 8, 9, 10, 11, 12], harvest: [1, 2, 3] },
    info_en: "Plant May-June. Takes 7-9 months. Nizamabad & Karimnagar are major districts. Harvest Jan-Mar.",
    info_te: "మే-జూన్‌లో నాటండి. 7-9 నెలలు పడుతుంది. నిజామాబాద్ & కరీంనగర్ ప్రధాన జిల్లాలు."
  },
  {
    id: "redgram", name_en: "Red Gram (Tur Dal)", name_te: "కంది పప్పు", region: "Both", emoji: "🫘",
    months: { sow: [6, 7], grow: [8, 9, 10, 11], harvest: [12, 1, 2] },
    info_en: "Sow June-July with onset of monsoon. Long duration crop (150-180 days). Harvest Dec-Feb.",
    info_te: "వర్షాకాలం ప్రారంభంలో జూన్-జూలైలో విత్తండి. దీర్ఘకాలిక పంట (150-180 రోజులు). డిసెంబర్-ఫిబ్రవరి కోత."
  },
];

const monthNames_en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNames_te = ["జన", "ఫిబ్ర", "మార్చి", "ఏప్రి", "మే", "జూన్", "జూలై", "ఆగ", "సెప్టె", "అక్టో", "నవం", "డిసెం"];

const CropCalendar = ({ onBack }: CropCalendarProps) => {
  const { lang, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const months = lang === "te" ? monthNames_te : monthNames_en;

  const getMonthColor = (month: number, crop: typeof crops[0]) => {
    if (crop.months.sow.includes(month)) return "bg-green-500 text-white";
    if (crop.months.harvest.includes(month)) return "bg-orange-500 text-white";
    if (crop.months.grow.includes(month)) return "bg-yellow-400 text-yellow-900";
    return "bg-muted text-muted-foreground";
  };

  const filtered = selectedCrop ? crops.filter(c => c.id === selectedCrop) : crops;

  return (
    <section className="px-4 py-4">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-4 active:scale-95 transition-transform min-h-[48px]">
        <ArrowLeft size={20} /> {t("🗓 పంట క్యాలెండర్", "🗓 Crop Calendar")}
      </button>

      {/* Crop Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCrop(null)}
          className={`px-3 py-2 rounded-xl text-sm font-bold min-h-[44px] active:scale-95 transition-transform ${!selectedCrop ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}
        >
          {t("అన్నీ", "All")}
        </button>
        {crops.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c.id)}
            className={`px-3 py-2 rounded-xl text-sm font-bold min-h-[44px] active:scale-95 transition-transform ${selectedCrop === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}
          >
            {c.emoji} {t(c.name_te, c.name_en)}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs font-bold">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-500" /> {t("విత్తనం", "Sowing")}</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-yellow-400" /> {t("పెరుగుదల", "Growing")}</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-orange-500" /> {t("కోత", "Harvest")}</span>
      </div>

      {/* Crop Cards */}
      <div className="space-y-4">
        {filtered.map(crop => (
          <div key={crop.id} className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-lg font-telugu">
                  {crop.emoji} {t(crop.name_te, crop.name_en)}
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${crop.region === "AP" ? "bg-blue-100 text-blue-700" : crop.region === "Telangana" ? "bg-pink-100 text-pink-700" : "bg-purple-100 text-purple-700"}`}>
                  {crop.region}
                </span>
              </div>
              <SpeakButton text={t(crop.info_te, crop.info_en)} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
            </div>

            {/* Month timeline */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <div key={m} className={`text-center py-1.5 rounded-lg text-[10px] sm:text-xs font-bold ${getMonthColor(m, crop)}`}>
                  {months[m - 1]}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground font-telugu">{t(crop.info_te, crop.info_en)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CropCalendar;
