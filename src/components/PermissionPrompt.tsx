import { useLanguage } from "@/contexts/LanguageContext";

interface PermissionPromptProps {
  type: "camera" | "location";
  onAllow: () => void;
  onCancel: () => void;
}

const prompts = {
  camera: {
    emoji: "📷",
    title_te: "కెమెరా అనుమతి",
    title_en: "Camera Permission",
    desc_te: "పంట రోగాలను గుర్తించడానికి మీ కెమెరాను ఉపయోగించాలి",
    desc_en: "We need your camera to scan crop diseases",
  },
  location: {
    emoji: "📍",
    title_te: "లొకేషన్ అనుమతి",
    title_en: "Location Permission",
    desc_te: "మీ ప్రాంత వాతావరణ సమాచారం కోసం లొకేషన్ అవసరం",
    desc_en: "We need your location to get weather updates for your area",
  },
};

const PermissionPrompt = ({ type, onAllow, onCancel }: PermissionPromptProps) => {
  const { lang } = useLanguage();
  const p = prompts[type];
  const t = (te: string, en: string) => (lang === "te" ? te : en);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-6">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full space-y-4 border-2 border-border shadow-lg">
        <div className="text-center">
          <span className="text-5xl">{p.emoji}</span>
          <h3 className="text-xl font-bold font-telugu text-foreground mt-3">{t(p.title_te, p.title_en)}</h3>
          <p className="text-muted-foreground font-telugu mt-2">{t(p.desc_te, p.desc_en)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-border font-telugu font-bold text-foreground active:scale-95 transition-transform min-h-[48px]"
          >
            {t("వద్దు", "Cancel")}
          </button>
          <button
            onClick={onAllow}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-telugu font-bold active:scale-95 transition-transform min-h-[48px]"
          >
            {t("అనుమతించు", "Allow")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionPrompt;
