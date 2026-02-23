import { useState } from "react";
import { ArrowLeft, Phone, Search, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SpeakButton from "./SpeakButton";

interface MandiLocatorProps {
  onBack: () => void;
}

const MandiLocator = ({ onBack }: MandiLocatorProps) => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const { data: mandis, isLoading } = useQuery({
    queryKey: ["mandis"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mandis" as any).select("*").order("district_en");
      if (error) throw error;
      return data as any[];
    },
  });

  const districts = [...new Set(mandis?.map((m: any) => m.district_en) || [])].sort();

  const filtered = mandis?.filter((m: any) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name_en?.toLowerCase().includes(q) || m.name_te?.includes(q) || m.district_en?.toLowerCase().includes(q);
    const matchDistrict = !districtFilter || m.district_en === districtFilter;
    return matchSearch && matchDistrict;
  });

  return (
    <section className="px-4 py-4">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-4 active:scale-95 transition-transform min-h-[48px]">
        <ArrowLeft size={20} /> {t("📍 మండి లొకేటర్", "📍 Mandi Locator")}
      </button>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("మార్కెట్ వెతకండి...", "Search market...")}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary text-sm min-h-[48px]"
          />
        </div>
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary text-sm min-h-[48px]"
        >
          <option value="">{t("అన్ని జిల్లాలు", "All Districts")}</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !filtered?.length ? (
        <p className="text-center text-muted-foreground py-12 font-telugu">{t("మార్కెట్‌లు కనుగొనబడలేదు", "No markets found")}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((m: any) => (
            <div key={m.id} className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-base font-telugu">
                    📍 {t(m.name_te || m.name_en, m.name_en)}
                  </h3>
                  <p className="text-sm text-muted-foreground font-telugu">
                    {t(m.district_te || m.district_en, m.district_en)}
                  </p>
                </div>
                <SpeakButton
                  text={t(
                    `${m.name_te || m.name_en}, ${m.district_te || m.district_en}. ${m.crops_te || m.crops_en || ""}`,
                    `${m.name_en}, ${m.district_en}. ${m.crops_en || ""}`
                  )}
                  lang={lang === "te" ? "te-IN" : "en-US"}
                  size="sm"
                />
              </div>

              {m.address_en && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="font-telugu">{t(m.address_te || m.address_en, m.address_en)}</span>
                </div>
              )}

              {m.opening_hours && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} className="flex-shrink-0" />
                  <span>{m.opening_hours}</span>
                </div>
              )}

              {m.crops_en && (
                <p className="text-sm font-telugu">
                  <span className="font-bold text-foreground">{t("పంటలు: ", "Crops: ")}</span>
                  <span className="text-muted-foreground">{t(m.crops_te || m.crops_en, m.crops_en)}</span>
                </p>
              )}

              {m.phone && (
                <a
                  href={`tel:${m.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-transform min-h-[44px]"
                >
                  <Phone size={16} /> {m.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MandiLocator;
