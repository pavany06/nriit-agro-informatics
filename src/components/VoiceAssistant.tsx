import { Mic, MicOff, X } from "lucide-react";
import { useState } from "react";

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని. మీకు ఏమి సహాయం కావాలో చెప్పండి. 🌾" },
  ]);
  const [input, setInput] = useState("");

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("మీ బ్రౌజర్ వాయిస్ ని సపోర్ట్ చేయడం లేదు");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN";
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
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");

    // Demo response (Gemini API needed for real)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "మీ ప్రశ్నకు ధన్యవాదాలు! AI సహాయకుడు త్వరలో అందుబాటులో ఉంటాడు. ప్రస్తుతం డెమో మోడ్‌లో ఉన్నాం. 🌱",
        },
      ]);

      // Speak response
      const utterance = new SpeechSynthesisUtterance(
        "మీ ప్రశ్నకు ధన్యవాదాలు! AI సహాయకుడు త్వరలో అందుబాటులో ఉంటాడు."
      );
      utterance.lang = "te-IN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg animate-pulse-glow z-50 active:scale-95 transition-transform"
        aria-label="AI సహాయకుడు"
      >
        <Mic size={28} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] bg-background border border-border rounded-none sm:rounded-2xl shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-none sm:rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎤</span>
          <h3 className="font-bold font-telugu text-lg">AI సహాయకుడు</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="active:scale-95 transition-transform">
          <X size={24} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 font-telugu text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card text-card-foreground border border-border rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all ${
              isListening
                ? "bg-destructive text-destructive-foreground animate-pulse-glow"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="మీ ప్రశ్న టైప్ చేయండి..."
            className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm font-telugu outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-telugu font-bold text-sm active:scale-95 transition-transform"
          >
            పంపు
          </button>
        </div>
        {isListening && (
          <p className="text-center text-sm text-accent font-telugu mt-2 animate-pulse">
            🎤 వింటున్నాను... మాట్లాడండి
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
