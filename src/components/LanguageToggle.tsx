import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ADMIN_PIN = "1266";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setShowPin(true);
      setPin("");
      setError(false);
      return;
    }

    clickTimer.current = setTimeout(() => {
      // Single click: toggle language
      if (clickCount.current < 3) {
        setLang(lang === "te" ? "en" : "te");
      }
      clickCount.current = 0;
    }, 400);
  };

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value === ADMIN_PIN) {
      setShowPin(false);
      navigate("/admin/login");
    } else if (value.length === 4) {
      setError(true);
      setTimeout(() => { setPin(""); setError(false); }, 800);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold active:scale-95 transition-transform border border-primary/20"
      >
        {lang === "te" ? "English" : "తెలుగు"}
      </button>

      <Dialog open={showPin} onOpenChange={setShowPin}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center text-base">Enter Admin PIN</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <InputOTP maxLength={4} value={pin} onChange={handlePinComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            {error && <p className="text-destructive text-sm">Wrong PIN</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LanguageToggle;
