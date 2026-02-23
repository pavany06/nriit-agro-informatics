import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useState, useCallback, useRef } from "react";

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

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SpeakButton = ({ text, lang = "te-IN", className = "", size = "md" }: SpeakButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async () => {
    if (isSpeaking) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsSpeaking(false);
      return;
    }

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    setIsLoading(true);
    try {
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: cleaned }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(audioUrl); };
      await audio.play();
      setIsSpeaking(true);
    } catch {
      // Fallback to browser TTS
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } finally {
      setIsLoading(false);
    }
  }, [text, lang, isSpeaking]);

  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
  const iconSize = { sm: 16, md: 20, lg: 28 };

  return (
    <button
      onClick={speak}
      disabled={isLoading}
      className={`inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 ${
        isSpeaking ? "animate-pulse-glow" : ""
      } ${sizeClasses[size]} ${className}`}
      aria-label={isSpeaking ? "ఆపండి" : "వినండి"}
    >
      {isLoading ? <Loader2 size={iconSize[size]} className="animate-spin" /> : isSpeaking ? <VolumeX size={iconSize[size]} /> : <Volume2 size={iconSize[size]} />}
    </button>
  );
};

export default SpeakButton;
