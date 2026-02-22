import { createContext, useContext, useState, ReactNode } from "react";

type Language = "te" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (te: string | null | undefined, en: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "te",
  setLang: () => {},
  t: (te, en) => te || en || "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("te");

  const t = (te: string | null | undefined, en: string | null | undefined): string => {
    if (lang === "te") return te || en || "";
    return en || te || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
