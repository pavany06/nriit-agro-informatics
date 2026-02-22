import { useState } from "react";
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

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBack = () => setActiveSection(null);

  const renderSection = () => {
    switch (activeSection) {
      case "weather":
        return <WeatherSection onBack={handleBack} />;
      case "disease":
        return <DiseaseScanner onBack={handleBack} />;
      case "market":
        return <MarketRates onBack={handleBack} />;
      case "schemes":
        return <GovernmentSchemes onBack={handleBack} />;
      case "news":
        return <AgriNews onBack={handleBack} />;
      case "methods":
        return <FarmingMethods onBack={handleBack} />;
      case "videos":
        return <LearningVideos onBack={handleBack} />;
      case "voice":
        setActiveSection(null);
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-bold font-telugu text-foreground text-lg">NRIIT Agro</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-bold">
              తెలుగు
            </span>
          </div>
        </div>
      </header>

      {activeSection ? (
        renderSection()
      ) : (
        <>
          <HeroSection />
          <FeatureGrid onSectionClick={setActiveSection} />

          {/* Footer */}
          <footer className="text-center px-4 py-6 mt-4 border-t border-border">
            <p className="text-sm text-muted-foreground font-telugu">
              🌾 NRIIT వ్యవసాయ సమాచారం © 2026
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              తెలుగు రైతుల కోసం ❤️ తో తయారు చేయబడింది
            </p>
          </footer>
        </>
      )}

      {/* Floating Voice Assistant */}
      <VoiceAssistant />
    </div>
  );
};

export default Index;
