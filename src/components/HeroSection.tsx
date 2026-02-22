import heroImage from "@/assets/hero-farming.jpg";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { lang } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4">
      <div className="absolute inset-0">
        <img src={heroImage} alt="వ్యవసాయ క్షేత్రం" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
      </div>
      <div className="relative z-10 px-6 py-12 sm:py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">🌾</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-primary-foreground drop-shadow-lg font-telugu">
            {lang === "te" ? "NRIIT వ్యవసాయ సమాచారం" : "NRIIT Agro Informatics"}
          </h1>
          <span className="text-4xl">🌾</span>
        </div>
        <p className="text-lg sm:text-xl text-primary-foreground/90 mb-6 font-telugu drop-shadow">
          {lang === "te" ? "తెలుగు రైతులకు స్మార్ట్ వ్యవసాయ సహాయకుడు" : "Smart Agriculture Assistant for Telugu Farmers"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <SpeakButton
            text={lang === "te"
              ? "NRIIT వ్యవసాయ సమాచారం లో స్వాగతం. మీకు వాతావరణం, పంట ధరలు, ప్రభుత్వ పథకాలు, మరియు ఆధునిక వ్యవసాయ పద్ధతులు అన్ని సమాచారం ఇక్కడ దొరుకుతుంది."
              : "Welcome to NRIIT Agro Informatics. Here you can find weather, crop prices, government schemes, and modern farming methods."}
            lang={lang === "te" ? "te-IN" : "en-US"}
            size="lg"
          />
          <span className="text-primary-foreground/80 font-telugu text-sm">
            🔊 {lang === "te" ? "వినండి" : "Listen"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
