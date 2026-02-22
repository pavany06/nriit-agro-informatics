import { CloudSun, Droplets, Wind, Thermometer, MapPin, ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useState, useEffect } from "react";

interface WeatherSectionProps {
  onBack: () => void;
}

interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
  city: string;
}

const WeatherSection = ({ onBack }: WeatherSectionProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Demo weather data (API key needed for real data)
    const timer = setTimeout(() => {
      setWeather({
        temp: 34,
        humidity: 65,
        wind: 12,
        condition: "పాక్షికంగా మేఘావృతం",
        icon: "⛅",
        city: "గుంటూరు",
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getAlert = () => {
    if (!weather) return null;
    if (weather.temp > 35) return { text: "⚠️ అధిక ఉష్ణోగ్రత హెచ్చరిక! బయట పనులు తగ్గించండి.", type: "destructive" as const };
    if (weather.humidity > 80) return { text: "🌧 వర్షం పడే అవకాశం ఉంది. పంటలను జాగ్రత్తగా చూసుకోండి.", type: "warning" as const };
    return null;
  };

  const alert = getAlert();

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🌦</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">వాతావరణం</h2>
        {weather && (
          <SpeakButton
            text={`${weather.city} లో ఈ రోజు ఉష్ణోగ్రత ${weather.temp} డిగ్రీలు. గాలి వేగం ${weather.wind} కిలోమీటర్లు. తేమ ${weather.humidity} శాతం. ${alert ? alert.text : "వాతావరణం బాగుంది."}`}
            size="md"
          />
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : weather ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground font-telugu">
            <MapPin size={18} />
            <span>{weather.city}</span>
          </div>

          {alert && (
            <div className={`p-4 rounded-xl border-2 ${alert.type === "destructive" ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-warning/10 border-warning/30 text-warning-foreground"} font-telugu text-lg`}>
              {alert.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
              <span className="text-5xl mb-2 block">{weather.icon}</span>
              <span className="text-4xl font-bold text-foreground">{weather.temp}°C</span>
              <p className="text-muted-foreground font-telugu mt-1">{weather.condition}</p>
            </div>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                <Droplets className="text-blue-500" size={28} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                  <p className="text-sm text-muted-foreground font-telugu">తేమ</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                <Wind className="text-teal-500" size={28} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{weather.wind} km/h</p>
                  <p className="text-sm text-muted-foreground font-telugu">గాలి వేగం</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-destructive font-telugu">{error || "వాతావరణ సమాచారం లోడ్ కాలేదు"}</p>
      )}
    </section>
  );
};

export default WeatherSection;
