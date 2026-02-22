import { ArrowLeft, Mic, MicOff, Search, Loader2 } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef } from "react";

interface MarketRatesProps {
  onBack: () => void;
}

interface MarketRecord {
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrival_date: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const cropEmojis: Record<string, string> = {
  paddy: "🌾", rice: "🌾", wheat: "🌾", chilli: "🌶", chillies: "🌶",
  onion: "🧅", tomato: "🍅", maize: "🌽", groundnut: "🥜", cotton: "🏵",
  turmeric: "🟡", banana: "🍌", mango: "🥭", potato: "🥔", sugarcane: "🎋",
  jowar: "🌿", bajra: "🌿", ragi: "🌿", soyabean: "🫘", sunflower: "🌻",
};

const getEmoji = (commodity: string) => {
  const lower = commodity.toLowerCase();
  for (const [key, emoji] of Object.entries(cropEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌱";
};

const MarketRates = ({ onBack }: MarketRatesProps) => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<MarketRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [searched, setSearched] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fetchPrices = async (commodity: string) => {
    if (!commodity.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/market-prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commodity: commodity.trim(), state: "Andhra Pradesh" }),
      });
      if (!resp.ok) throw new Error("Failed");
      const data = await resp.json();
      setRecords(data.records || []);
      if ((data.records || []).length === 0) {
        setError(lang === "te" ? "ఈ పంటకు ధరలు లేవు. వేరే పేరు ప్రయత్నించండి." : "No prices found. Try a different crop name.");
      }
    } catch {
      setError(lang === "te" ? "ధరలు లోడ్ కాలేదు" : "Failed to load prices");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(lang === "te" ? "మీ బ్రౌజర్ వాయిస్ మద్దతు లేదు" : "Voice not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "te" ? "te-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
      fetchPrices(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">💰</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
          {lang === "te" ? "మార్కెట్ ధరలు" : "Market Rates"}
        </h2>
      </div>

      <p className="text-muted-foreground font-telugu mb-4 text-sm">
        {lang === "te" ? "🎤 పంట పేరు చెప్పండి లేదా టైప్ చేయండి (ఆంధ్రప్రదేశ్ మార్కెట్లు)" : "🎤 Say or type a crop name (Andhra Pradesh markets)"}
      </p>

      {/* Search bar with mic */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPrices(query)}
            placeholder={lang === "te" ? "పంట పేరు... (ఉదా: Rice, Chilli)" : "Crop name... (e.g. Rice, Chilli)"}
            className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-border bg-card text-foreground font-telugu text-lg focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={() => fetchPrices(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary"
          >
            <Search size={20} />
          </button>
        </div>
        <button
          onClick={listening ? stopListening : startListening}
          className={`p-3 rounded-xl border-2 transition-all ${
            listening
              ? "bg-destructive/10 border-destructive text-destructive animate-pulse"
              : "bg-primary/10 border-primary text-primary"
          }`}
        >
          {listening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>

      {listening && (
        <div className="text-center py-4 text-primary font-telugu text-lg animate-pulse">
          🎤 {lang === "te" ? "వింటున్నాను... పంట పేరు చెప్పండి" : "Listening... say a crop name"}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      {error && <p className="text-destructive font-telugu text-center py-4">{error}</p>}

      {!loading && records.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-telugu">
              📅 {lang === "te" ? `${records.length} ఫలితాలు (₹/క్వింటాల్)` : `${records.length} results (₹/quintal)`}
            </p>
            <SpeakButton
              text={lang === "te"
                ? `${records[0].commodity} ధర ${records[0].market} లో. కనిష్ట ${records[0].min_price}, గరిష్ట ${records[0].max_price}, సాధారణ ${records[0].modal_price} రూపాయలు.`
                : `${records[0].commodity} price in ${records[0].market}. Min ${records[0].min_price}, Max ${records[0].max_price}, Modal ${records[0].modal_price} rupees.`}
              lang={lang === "te" ? "te-IN" : "en-US"} size="md"
            />
          </div>

          {records.map((r, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 border border-border card-hover">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold font-telugu">
                  {getEmoji(r.commodity)} {r.commodity}
                </span>
                <SpeakButton
                  text={lang === "te"
                    ? `${r.market} లో ${r.commodity} ${r.variety} ధర. కనిష్ట ${r.min_price}, గరిష్ట ${r.max_price}, సాధారణ ${r.modal_price} రూపాయలు.`
                    : `${r.commodity} ${r.variety} price in ${r.market}. Min ${r.min_price}, Max ${r.max_price}, Modal ${r.modal_price} rupees.`}
                  lang={lang === "te" ? "te-IN" : "en-US"} size="sm"
                />
              </div>
              {r.variety && (
                <p className="text-xs text-muted-foreground mb-2 font-telugu">
                  {lang === "te" ? "రకం" : "Variety"}: {r.variety}
                </p>
              )}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-destructive/10 rounded-lg py-2">
                  <p className="text-xs text-muted-foreground font-telugu">{lang === "te" ? "కనిష్ట" : "Min"}</p>
                  <p className="text-lg font-bold text-destructive">₹{r.min_price.toLocaleString()}</p>
                </div>
                <div className="bg-success/10 rounded-lg py-2">
                  <p className="text-xs text-muted-foreground font-telugu">{lang === "te" ? "గరిష్ట" : "Max"}</p>
                  <p className="text-lg font-bold text-success">₹{r.max_price.toLocaleString()}</p>
                </div>
                <div className="bg-primary/10 rounded-lg py-2">
                  <p className="text-xs text-muted-foreground font-telugu">{lang === "te" ? "సాధారణ" : "Modal"}</p>
                  <p className="text-lg font-bold text-primary">₹{r.modal_price.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-telugu">
                📍 {r.market}, {r.district} • 📅 {r.arrival_date}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && !searched && (
        <div className="text-center py-8 text-muted-foreground font-telugu">
          <p className="text-4xl mb-3">🎤</p>
          <p className="text-lg">{lang === "te" ? "మైక్ నొక్కి పంట పేరు చెప్పండి" : "Press mic and say a crop name"}</p>
          <p className="text-sm mt-2">{lang === "te" ? "ఉదా: Rice, Chilli, Onion, Tomato" : "e.g. Rice, Chilli, Onion, Tomato"}</p>
        </div>
      )}
    </section>
  );
};

export default MarketRates;
