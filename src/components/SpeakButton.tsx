import { Volume2, Loader2, Square } from "lucide-react";
import { useState, useRef } from "react";
import { SUPABASE_URL } from "@/lib/supabaseUrl";

const TTS_URL = `${SUPABASE_URL}/functions/v1/azure-tts`;

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  voice?: string;
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
      setState("idle");
      return;
    }
    if (state === "loading") return;

    setState("loading");
    try {
      const selectedVoice = voice || (lang?.startsWith("te") ? "te-IN-ShrutiNeural" : "te-IN-ShrutiNeural");
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "TTS failed");
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setState("idle");
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      await audio.play();
      setState("playing");
    } catch (e) {
      console.error("TTS error:", e);
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
