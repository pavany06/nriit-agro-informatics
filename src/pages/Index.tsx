import { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import WeatherSection from "@/components/WeatherSection";
import DiseaseScanner from "@/components/DiseaseScanner";
import MarketRates from "@/components/MarketRates";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import AgriNews from "@/components/AgriNews";
import FarmingMethods from "@/components/FarmingMethods";
import LearningVideos from "@/components/LearningVideos";
import VoiceAssistant from "@/components/VoiceAssistant";
import LanguageToggle from "@/components/LanguageToggle";
import CropCalendar from "@/components/CropCalendar";
import MandiLocator from "@/components/MandiLocator";
import FarmerFeedback from "@/components/FarmerFeedback";
import EmergencyHelpline from "@/components/EmergencyHelpline";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SpeakButton from "@/components/SpeakButton";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { lang } = useLanguage();

  const { data: alerts } = useQuery({
    queryKey: ["home_alerts"],
    queryFn: async () => {
      const { data } = await supabase.from("alerts").select("*").eq("active", true).order("created_at", { ascending: false }).limit(3);
      return data || [];
    }
  });

  const handleBack = () => setActiveSection(null);

  const renderSection = () => {
    switch (activeSection) {
      case "weather":return <WeatherSection onBack={handleBack} />;
      case "disease":return <DiseaseScanner onBack={handleBack} />;
      case "market":return <MarketRates onBack={handleBack} />;
      case "schemes":return <GovernmentSchemes onBack={handleBack} />;
      case "news":return <AgriNews onBack={handleBack} />;
      case "methods":return <FarmingMethods onBack={handleBack} />;
      case "videos":return <LearningVideos onBack={handleBack} />;
      case "calendar":return <CropCalendar onBack={handleBack} />;
      case "mandi":return <MandiLocator onBack={handleBack} />;
      case "feedback":return <FarmerFeedback onBack={handleBack} />;
      case "helpline":return <EmergencyHelpline onBack={handleBack} />;
      case "voice":
        // Trigger voice assistant by dispatching custom event
        window.dispatchEvent(new CustomEvent("open-voice-assistant"));
        setActiveSection(null);
        return null;
      default:return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-2xl mx-auto">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-bold font-telugu text-foreground text-lg">NRIIT Agro Informatics</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {activeSection ?
      renderSection() :

      <>
          <HeroSection />

          {/* Active Alerts */}
          {alerts && alerts.length > 0 &&
        <div className="px-4 pt-4 space-y-2">
              {alerts.map((a) =>
          <div key={a.id} className={`p-3 rounded-xl border font-telugu text-sm flex items-center justify-between ${
          a.alert_type === "danger" ? "bg-destructive/10 border-destructive/30 text-destructive" :
          a.alert_type === "warning" ? "bg-warning/10 border-warning/30 text-warning-foreground" :
          "bg-primary/10 border-primary/30 text-primary"}`
          }>
                  <span>{a.alert_type === "danger" ? "🚨" : a.alert_type === "warning" ? "⚠️" : "ℹ️"} {lang === "te" ? a.message_te || a.message_en : a.message_en}</span>
                  <SpeakButton text={lang === "te" ? a.message_te || a.message_en : a.message_en} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
                </div>
          )}
            </div>
        }

          <FeatureGrid onSectionClick={setActiveSection} />

          <footer className="text-center px-4 py-6 mt-4 border-t border-border">
            <p className="text-sm text-muted-foreground font-telugu">🌾 NRIIT వ్యవసాయ సమాచారం © 2026</p>
            
          </footer>
        </>
      }

      <VoiceAssistant />
    </div>);

};

export default Index;