import { useState } from "react";
import { ArrowLeft, Mic, MicOff, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SpeakButton from "./SpeakButton";

interface FarmerFeedbackProps {
  onBack: () => void;
}

const FarmerFeedback = ({ onBack }: FarmerFeedbackProps) => {
  const { lang, t } = useLanguage();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("feedback");
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(t("మీ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు", "Voice input not available in your browser"));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "te" ? "te-IN" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error(t("వాయిస్ ఇన్‌పుట్ విఫలమైంది", "Voice input failed"));
    };

    recognition.start();
    setIsRecording(true);

    // Store reference to stop later
    (window as any).__feedbackRecognition = recognition;
  };

  const stopVoiceInput = () => {
    const recognition = (window as any).__feedbackRecognition;
    if (recognition) {
      recognition.stop();
      delete (window as any).__feedbackRecognition;
    }
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error(t("దయచేసి మీ సందేశం రాయండి", "Please enter your message"));
      return;
    }
    if (mobile && !/^[6-9]\d{9}$/.test(mobile.trim())) {
      toast.error(t("చెల్లుబాటు అయ్యే మొబైల్ నంబర్ నమోదు చేయండి", "Enter a valid 10-digit mobile number"));
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("feedback" as any).insert({
        name: name.trim() || null,
        mobile: mobile.trim() || null,
        message: message.trim(),
        feedback_type: feedbackType,
      } as any);
      if (error) throw error;
      setSubmitted(true);
      toast.success(t("మీ అభిప్రాయం పంపబడింది!", "Your feedback has been submitted!"));
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const confirmMsg = t(
      "మీ అభిప్రాయం విజయవంతంగా పంపబడింది. మేము త్వరలో మీకు తిరిగి వస్తాము.",
      "Your feedback has been submitted successfully. We will get back to you soon."
    );
    return (
      <section className="px-4 py-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-300 dark:border-green-700 p-8 text-center space-y-4">
          <span className="text-5xl">✅</span>
          <h3 className="text-xl font-bold text-foreground font-telugu">{t("ధన్యవాదాలు!", "Thank you!")}</h3>
          <p className="text-muted-foreground font-telugu">{confirmMsg}</p>
          <SpeakButton text={confirmMsg} lang={lang === "te" ? "te-IN" : "en-US"} size="lg" className="mx-auto" />
          <button onClick={onBack} className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold active:scale-95 transition-transform min-h-[48px]">
            {t("వెనుకకు", "Go Back")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-4">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-4 active:scale-95 transition-transform min-h-[48px]">
        <ArrowLeft size={20} /> {t("📝 అభిప్రాయం / విచారణ", "📝 Feedback / Enquiry")}
      </button>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 font-telugu">{t("రకం", "Type")}</label>
          <div className="flex gap-2">
            {[
              { val: "feedback", label_te: "అభిప్రాయం", label_en: "Feedback", emoji: "💬" },
              { val: "enquiry", label_te: "విచారణ", label_en: "Enquiry", emoji: "❓" },
              { val: "complaint", label_te: "ఫిర్యాదు", label_en: "Complaint", emoji: "⚠️" },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setFeedbackType(opt.val)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform min-h-[48px] ${feedbackType === opt.val ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}
              >
                {opt.emoji} {t(opt.label_te, opt.label_en)}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-1 font-telugu">{t("పేరు (ఐచ్ఛికం)", "Name (Optional)")}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("మీ పేరు", "Your name")}
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
            maxLength={100}
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-1 font-telugu">{t("మొబైల్ నంబర్", "Mobile Number")}</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9876543210"
            type="tel"
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
          />
        </div>

        {/* Message with voice */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-1 font-telugu">{t("సందేశం", "Message")} *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("మీ సందేశం ఇక్కడ రాయండి లేదా మైక్ బటన్ నొక్కి మాట్లాడండి...", "Type your message or tap the mic button to speak...")}
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform min-h-[44px] ${isRecording ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-accent text-accent-foreground"}`}
            >
              {isRecording ? <><MicOff size={18} /> {t("ఆపండి", "Stop")}</> : <><Mic size={18} /> {t("మాట్లాడండి", "Speak")}</>}
            </button>
            <span className="text-xs text-muted-foreground">{message.length}/1000</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !message.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg active:scale-95 transition-transform disabled:opacity-50 min-h-[56px]"
        >
          <Send size={20} /> {submitting ? t("పంపుతోంది...", "Submitting...") : t("పంపండి", "Submit")}
        </button>
      </div>
    </section>
  );
};

export default FarmerFeedback;
