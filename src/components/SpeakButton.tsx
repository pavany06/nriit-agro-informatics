import { Volume2 } from "lucide-react";

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SpeakButton = ({ text, lang, className = "", size = "md" }: SpeakButtonProps) => {
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
  const iconSize = { sm: 16, md: 20, lg: 28 };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-200 hover:opacity-90 active:scale-95 ${sizeClasses[size]} ${className}`}
      aria-label="వినండి"
    >
      <Volume2 size={iconSize[size]} />
    </button>
  );
};

export default SpeakButton;
