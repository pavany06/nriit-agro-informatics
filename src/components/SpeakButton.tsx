import { Volume2, VolumeX } from "lucide-react";
import { useState, useCallback } from "react";

const cleanForSpeech = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[🌾🚜✅❌⚠️🎤📝🗓📍🆘💬❓]/gu, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ", ")
    .trim();
};

const getBestVoice = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const prefix = langCode.split("-")[0];
  return voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(prefix)) || null;
};

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

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    window.speechSynthesis.cancel();

    const chunks = cleaned.match(/.{1,200}(?:[.!?,;]|\s|$)/g) || [cleaned];
    const isTeluguLang = lang.startsWith("te");

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = lang;
      utterance.rate = isTeluguLang ? 0.85 : 0.92;
      utterance.pitch = 1.0;
      const voice = getBestVoice(lang);
      if (voice) utterance.voice = voice;
      if (i === chunks.length - 1) {
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
      }
      window.speechSynthesis.speak(utterance);
    });

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
