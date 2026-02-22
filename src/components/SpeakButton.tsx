import { Volume2, VolumeX } from "lucide-react";
import { useState, useCallback } from "react";

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SpeakButton = ({ text, lang = "te-IN", className = "", size = "md" }: SpeakButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [text, lang, isSpeaking]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-200 hover:opacity-90 active:scale-95 ${
        isSpeaking ? "animate-pulse-glow" : ""
      } ${sizeClasses[size]} ${className}`}
      aria-label={isSpeaking ? "ఆపండి" : "వినండి"}
    >
      {isSpeaking ? <VolumeX size={iconSize[size]} /> : <Volume2 size={iconSize[size]} />}
    </button>
  );
};

export default SpeakButton;
