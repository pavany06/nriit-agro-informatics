import { Mic, MicOff, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/** Strip markdown, emojis, and special chars for cleaner speech */
const cleanForSpeech = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/#{1,6}\s/g, "") // headings
    .replace(/[🌾🚜✅❌⚠️🎤📝🗓📍🆘💬❓]/gu, "") // common emojis
    .replace(/\n{2,}/g, ". ") // double newlines to pause
    .replace(/\n/g, ", ") // single newlines
    .trim();
};

/** Pick the best available voice for given language */
const getBestVoice = (langCode: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const prefix = langCode.split("-")[0]; // "te" or "en"
  // Prefer voices matching full locale, then language prefix
  const exact = voices.find(v => v.lang === langCode);
  if (exact) return exact;
  const partial = voices.find(v => v.lang.startsWith(prefix));
  if (partial) return partial;
  // Fallback: any voice with "Telugu" or "Hindi" in name for Indic
  if (prefix === "te") {
    const indic = voices.find(v => /telugu|hindi/i.test(v.name));
    if (indic) return indic;
  }
  return null;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Msg = { role: "user" | "assistant"; content: string };

const VoiceAssistant = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: lang === "te" ? "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని. మీకు ఏమి సహాయం కావాలో చెప్పండి. 🌾" : "Hello! I'm your agriculture assistant. How can I help you? 🌾" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  /** Speak text with the best available voice, handling Telugu/English */
  const speakText = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    // Detect language: if >30% Telugu chars, use Telugu
    const teluguChars = (cleaned.match(/[\u0C00-\u0C7F]/g) || []).length;
    const isTeluguText = teluguChars / cleaned.length > 0.3;
    const speechLang = isTeluguText ? "te-IN" : "en-US";

    // Split into chunks for more natural speech (max ~200 chars each)
    const chunks = cleaned.match(/.{1,200}(?:[.!?,;]|\s|$)/g) || [cleaned];

    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = speechLang;
      utterance.rate = isTeluguText ? 0.85 : 0.92;
      utterance.pitch = 1.0;
      const voice = getBestVoice(speechLang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const streamChat = async (allMessages: Msg[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMessages.length) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
              scrollToBottom();
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Speak the response with best available voice
      if (assistantSoFar) {
        speakText(assistantSoFar);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: lang === "te" ? "❌ సేవ అందుబాటులో లేదు. మళ్ళీ ప్రయత్నించండి." : "❌ Service unavailable. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert(lang === "te" ? "మీ బ్రౌజర్ వాయిస్ ని సపోర్ట్ చేయడం లేదు" : "Voice not supported in your browser");
      return;
    }
    if (isListening) { setIsListening(false); return; }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "te" ? "te-IN" : "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const handleSend = (text?: string) => {
    const message = text || input;
    if (!message.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: message };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    streamChat(newMessages);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg animate-pulse-glow z-50 active:scale-95 transition-transform"
        aria-label="AI"
      >
        <Mic size={28} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] bg-background border border-border rounded-none sm:rounded-2xl shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-none sm:rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎤</span>
          <h3 className="font-bold font-telugu text-lg">{lang === "te" ? "AI సహాయకుడు" : "AI Assistant"}</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="active:scale-95 transition-transform"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 font-telugu text-sm ${
              msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-card-foreground border border-border rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button onClick={toggleListening} className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all ${
            isListening ? "bg-destructive text-destructive-foreground animate-pulse-glow" : "bg-accent text-accent-foreground"
          }`}>
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={lang === "te" ? "మీ ప్రశ్న టైప్ చేయండి..." : "Type your question..."}
            className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm font-telugu outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={() => handleSend()} disabled={isLoading} className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-telugu font-bold text-sm active:scale-95 transition-transform disabled:opacity-50">
            {lang === "te" ? "పంపు" : "Send"}
          </button>
        </div>
        {isListening && (
          <p className="text-center text-sm text-accent font-telugu mt-2 animate-pulse">
            🎤 {lang === "te" ? "వింటున్నాను... మాట్లాడండి" : "Listening... Speak now"}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
