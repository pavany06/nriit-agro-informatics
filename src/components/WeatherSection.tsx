import { Droplets, Wind, MapPin, ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeatherSectionProps {
  onBack: () => void;
}

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
  city: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const WeatherSection = ({ onBack }: WeatherSectionProps) => {
  const { lang } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/weather`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lon }),
        });
        if (!resp.ok) throw new Error("Failed");
        const data = await resp.json();
        setWeather(data);
      } catch (e) {
        setError(lang === "te" ? "వాతావరణ సమాచారం లోడ్ కాలేదు" : "Failed to load weather");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(16.3067, 80.4365) // Default: Guntur
      );
    } else {
      fetchWeather(16.3067, 80.4365);
    }
  }, [lang]);

  const getAlert = () => {
    if (!weather) return null;
    if (weather.temp > 35) return {
      text: lang === "te" ? "⚠️ అధిక ఉష్ణోగ్రత హెచ్చరిక! బయట పనులు తగ్గించండి." : "⚠️ High temperature alert! Reduce outdoor work.",
      type: "destructive" as const,
    };
    if (weather.humidity > 80) return {
      text: lang === "te" ? "🌧 వర్షం పడే అవకాశం ఉంది. పంటలను జాగ్రత్తగా చూసుకోండి." : "🌧 Rain expected. Take care of your crops.",
      type: "warning" as const,
    };
    return null;
  };

  const alert = getAlert();
  const iconUrl = weather?.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null;

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> {lang === "te" ? "వెనుకకు" : "Back"}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🌦</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
          {lang === "te" ? "వాతావరణం" : "Weather"}
        </h2>
        {weather && (
          <SpeakButton
            text={lang === "te"
              ? `${weather.city} లో ఈ రోజు ఉష్ణోగ్రత ${weather.temp} డిగ్రీలు. గాలి వేగం ${weather.wind} కిలోమీటర్లు. తేమ ${weather.humidity} శాతం.`
              : `Today in ${weather.city}, temperature is ${weather.temp} degrees. Wind speed ${weather.wind} km/h. Humidity ${weather.humidity}%.`}
            lang={lang === "te" ? "te-IN" : "en-US"}
            size="md"
          />
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-destructive font-telugu">{error}</p>
      ) : weather ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground font-telugu">
            <MapPin size={18} />
            <span>{weather.city}</span>
          </div>

          {alert && (
            <div className={`p-4 rounded-xl border-2 flex items-center justify-between gap-2 ${alert.type === "destructive" ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-warning/10 border-warning/30 text-warning-foreground"} font-telugu text-lg`}>
              <span>{alert.text}</span>
              <SpeakButton text={alert.text} lang={lang === "te" ? "te-IN" : "en-US"} size="sm" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
              {iconUrl && <img src={iconUrl} alt="weather" className="w-16 h-16 mx-auto" />}
              <span className="text-4xl font-bold text-foreground">{weather.temp}°C</span>
              <p className="text-muted-foreground font-telugu mt-1">{weather.condition}</p>
            </div>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                <Droplets className="text-blue-500" size={28} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                  <p className="text-sm text-muted-foreground font-telugu">{lang === "te" ? "తేమ" : "Humidity"}</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                <Wind className="text-teal-500" size={28} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{weather.wind} km/h</p>
                  <p className="text-sm text-muted-foreground font-telugu">{lang === "te" ? "గాలి వేగం" : "Wind"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default WeatherSection;
