import { Volume2, Loader2, Square } from "lucide-react";
import { useState, useRef } from "react";
import { SUPABASE_URL } from "@/lib/supabaseUrl";

const TTS_URL = `${SUPABASE_URL}/functions/v1/tts`;

// Simple in-memory cache to avoid duplicate API calls
const audioCache = new Map<string, string>();

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  voice?: string;
}

/** Browser/Android fallback TTS */
function fallbackSpeak(text: string, lang?: string) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang?.startsWith("te") ? "te-IN" : "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

const SpeakButton = ({ text, lang, className = "", size = "md", voice }: SpeakButtonProps) => {
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
  const iconSize = { sm: 16, md: 20, lg: 28 };
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    if (state === "playing") {
      audioRef.current?.pause();
      audioRef.current = null;
      window.speechSynthesis?.cancel();
      setState("idle");
      return;
    }
    if (state === "loading") return;

    setState("loading");
    try {
      const cacheKey = `${text.slice(0, 200)}_${voice || "default"}`;

      // Check cache first
      let blobUrl = audioCache.get(cacheKey);

      if (!blobUrl) {
        const resp = await fetch(TTS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voiceId: voice }),
        });

        if (!resp.ok) throw new Error("TTS failed");

        const blob = await resp.blob();
        blobUrl = URL.createObjectURL(blob);
        audioCache.set(cacheKey, blobUrl);
      }

      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setState("idle");
        audioRef.current = null;
      };

      await audio.play();
      setState("playing");
    } catch (e) {
      console.warn("ElevenLabs TTS failed, using fallback:", e);
      fallbackSpeak(text, lang);
      setState("idle");
    }
  };

  const Icon = state === "loading" ? Loader2 : state === "playing" ? Square : Volume2;

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className={`inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 ${sizeClasses[size]} ${className}`}
      aria-label="వినండి"
    >
      <Icon size={iconSize[size]} className={state === "loading" ? "animate-spin" : ""} />
    </button>
  );
};

export default SpeakButton;
