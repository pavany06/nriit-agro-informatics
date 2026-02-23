import { ArrowLeft, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "./SpeakButton";

interface EmergencyHelplineProps {
  onBack: () => void;
}

const helplines = [
  {
    category_en: "Agriculture Helplines", category_te: "వ్యవసాయ హెల్ప్‌లైన్లు", emoji: "🌾",
    numbers: [
      { name_en: "Kisan Call Center", name_te: "కిసాన్ కాల్ సెంటర్", phone: "1800-180-1551", desc_en: "24/7 Free farming advice", desc_te: "24/7 ఉచిత వ్యవసాయ సలహా" },
      { name_en: "AP Agriculture Helpline", name_te: "AP వ్యవసాయ హెల్ప్‌లైన్", phone: "1800-425-1110", desc_en: "Andhra Pradesh Agriculture Dept", desc_te: "ఆంధ్రప్రదేశ్ వ్యవసాయ శాఖ" },
      { name_en: "TS Agriculture Helpline", name_te: "TS వ్యవసాయ హెల్ప్‌లైన్", phone: "1800-599-5559", desc_en: "Telangana Agriculture Dept", desc_te: "తెలంగాణ వ్యవసాయ శాఖ" },
    ],
  },
  {
    category_en: "Insurance & Finance", category_te: "బీమా & ఆర్థిక", emoji: "💰",
    numbers: [
      { name_en: "PMFBY Crop Insurance", name_te: "PMFBY పంట బీమా", phone: "1800-200-7710", desc_en: "Pradhan Mantri Fasal Bima Yojana", desc_te: "ప్రధానమంత్రి ఫసల్ బీమా యోజన" },
    ],
  },
  {
    category_en: "Animal Husbandry", category_te: "పశుసంవర్ధక", emoji: "🐄",
    numbers: [
      { name_en: "Animal Husbandry Helpline", name_te: "పశుసంవర్ధక హెల్ప్‌లైన్", phone: "1962", desc_en: "Veterinary emergencies", desc_te: "పశువైద్య అత్యవసరాలు" },
    ],
  },
  {
    category_en: "Emergency Services", category_te: "అత్యవసర సేవలు", emoji: "🚨",
    numbers: [
      { name_en: "Police", name_te: "పోలీసులు", phone: "100", desc_en: "Police emergency", desc_te: "పోలీసు అత్యవసరం" },
      { name_en: "Ambulance", name_te: "అంబులెన్స్", phone: "108", desc_en: "Medical emergency", desc_te: "వైద్య అత్యవసరం" },
      { name_en: "Fire Service", name_te: "అగ్నిమాపక సేవ", phone: "101", desc_en: "Fire emergency", desc_te: "అగ్ని అత్యవసరం" },
      { name_en: "Women Helpline", name_te: "మహిళా హెల్ప్‌లైన్", phone: "181", desc_en: "Women safety helpline", desc_te: "మహిళా భద్రత హెల్ప్‌లైన్" },
    ],
  },
];

const EmergencyHelpline = ({ onBack }: EmergencyHelplineProps) => {
  const { lang, t } = useLanguage();

  return (
    <section className="px-4 py-4">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-4 active:scale-95 transition-transform min-h-[48px]">
        <ArrowLeft size={20} /> {t("🆘 అత్యవసర హెల్ప్‌లైన్", "🆘 Emergency Helpline")}
      </button>

      <div className="space-y-5">
        {helplines.map((cat, ci) => (
          <div key={ci}>
            <h3 className="text-lg font-bold text-foreground font-telugu mb-3">
              {cat.emoji} {t(cat.category_te, cat.category_en)}
            </h3>
            <div className="space-y-2">
              {cat.numbers.map((num, ni) => (
                <div key={ni} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground font-telugu">{t(num.name_te, num.name_en)}</h4>
                    <p className="text-xs text-muted-foreground font-telugu">{t(num.desc_te, num.desc_en)}</p>
                  </div>
                  <SpeakButton text={t(num.name_te, num.name_en) + ". " + num.phone} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
                  <a
                    href={`tel:${num.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-transform min-h-[44px] whitespace-nowrap"
                  >
                    <Phone size={16} /> {num.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmergencyHelpline;
