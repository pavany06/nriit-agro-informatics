import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "te" ? "en" : "te")}
      className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold active:scale-95 transition-transform border border-primary/20"
    >
      {lang === "te" ? "English" : "తెలుగు"}
    </button>
  );
};

export default LanguageToggle;
