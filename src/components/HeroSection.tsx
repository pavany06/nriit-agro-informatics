import heroImage from "@/assets/hero-farming.jpg";
import SpeakButton from "./SpeakButton";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="వ్యవసాయ క్షేత్రం"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
      </div>

      <div className="relative z-10 px-6 py-12 sm:py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">🌾</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-primary-foreground drop-shadow-lg font-telugu">
            NRIIT వ్యవసాయ సమాచారం
          </h1>
          <span className="text-4xl">🌾</span>
        </div>

        <p className="text-lg sm:text-xl text-primary-foreground/90 mb-6 font-telugu drop-shadow">
          తెలుగు రైతులకు స్మార్ట్ వ్యవసాయ సహాయకుడు
        </p>

        <div className="flex items-center justify-center gap-3">
          <SpeakButton
            text="NRIIT వ్యవసాయ సమాచారం లో స్వాగతం. మీకు వాతావరణం, పంట ధరలు, ప్రభుత్వ పథకాలు, మరియు ఆధునిక వ్యవసాయ పద్ధతులు అన్ని సమాచారం ఇక్కడ దొరుకుతుంది."
            size="lg"
          />
          <span className="text-primary-foreground/80 font-telugu text-sm">🔊 వినండి</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
