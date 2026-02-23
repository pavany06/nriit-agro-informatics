import { useState, useEffect } from "react";
import { Bell, BellRing, X, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceAlert {
  id: string;
  crop: string;
  threshold: number;
  type: "above" | "below";
  triggered: boolean;
}

interface MarketRecord {
  commodity: string;
  modal_price: number;
  market: string;
  state: string;
}

interface PriceAlertManagerProps {
  records: MarketRecord[];
  availableCrops: string[];
}

const PriceAlertManager = ({ records, availableCrops }: PriceAlertManagerProps) => {
  const { lang } = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem("price-alerts");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newCrop, setNewCrop] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [newType, setNewType] = useState<"above" | "below">("above");
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    localStorage.setItem("price-alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Check alerts against current prices
  useEffect(() => {
    if (records.length === 0 || alerts.length === 0) return;

    const triggered: PriceAlert[] = [];
    const updated = alerts.map((alert) => {
      const matching = records.filter(
        (r) => r.commodity.toLowerCase() === alert.crop.toLowerCase()
      );
      if (matching.length === 0) return alert;

      const maxPrice = Math.max(...matching.map((r) => r.modal_price));
      const minPrice = Math.min(...matching.map((r) => r.modal_price));

      const isTriggered =
        (alert.type === "above" && maxPrice >= alert.threshold) ||
        (alert.type === "below" && minPrice <= alert.threshold);

      if (isTriggered && !alert.triggered) {
        triggered.push({ ...alert, triggered: true });
      }

      return { ...alert, triggered: isTriggered };
    });

    if (triggered.length > 0) {
      setTriggeredAlerts(triggered);
      setAlerts(updated);
    }
  }, [records, alerts]);

  const addAlert = () => {
    if (!newCrop || !newThreshold) return;
    const alert: PriceAlert = {
      id: Date.now().toString(),
      crop: newCrop,
      threshold: Number(newThreshold),
      type: newType,
      triggered: false,
    };
    setAlerts((prev) => [...prev, alert]);
    setNewCrop("");
    setNewThreshold("");
    setShowForm(false);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const dismissTriggered = () => setTriggeredAlerts([]);

  return (
    <div className="space-y-3">
      {/* Triggered alert notifications */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BellRing className="text-destructive" size={22} />
              <span className="font-bold font-telugu text-destructive">
                {lang === "te" ? "ధర హెచ్చరిక!" : "Price Alert!"}
              </span>
            </div>
            <button onClick={dismissTriggered} className="text-muted-foreground">
              <X size={18} />
            </button>
          </div>
          {triggeredAlerts.map((a) => (
            <p key={a.id} className="text-sm font-telugu text-foreground">
              🔔 {a.crop} {lang === "te" ? "ధర" : "price"}{" "}
              {a.type === "above"
                ? lang === "te" ? `₹${a.threshold} పైన ఉంది` : `is above ₹${a.threshold}`
                : lang === "te" ? `₹${a.threshold} కింద ఉంది` : `is below ₹${a.threshold}`}
            </p>
          ))}
        </div>
      )}

      {/* Alert management */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            <h3 className="font-bold font-telugu text-foreground">
              {lang === "te" ? "ధర హెచ్చరికలు" : "Price Alerts"}
            </h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-telugu"
          >
            <Plus size={16} /> {lang === "te" ? "జోడించు" : "Add"}
          </button>
        </div>

        {showForm && (
          <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-xl">
            <select
              value={newCrop}
              onChange={(e) => setNewCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground font-telugu text-sm"
            >
              <option value="">{lang === "te" ? "పంట ఎంచుకోండి" : "Select crop"}</option>
              {availableCrops.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as "above" | "below")}
                className="px-3 py-2 rounded-lg border border-border bg-card text-foreground font-telugu text-sm"
              >
                <option value="above">{lang === "te" ? "పైన" : "Above"}</option>
                <option value="below">{lang === "te" ? "కింద" : "Below"}</option>
              </select>
              <input
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                placeholder="₹ threshold"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
              />
            </div>
            <button
              onClick={addAlert}
              disabled={!newCrop || !newThreshold}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-telugu text-sm disabled:opacity-50"
            >
              {lang === "te" ? "హెచ్చరిక సెట్ చేయి" : "Set Alert"}
            </button>
          </div>
        )}

        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground font-telugu text-center py-2">
            {lang === "te" ? "హెచ్చరికలు లేవు" : "No alerts set"}
          </p>
        ) : (
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm ${a.triggered ? "bg-destructive/10 border border-destructive/30" : "bg-muted/50"}`}>
                <span className="font-telugu text-foreground">
                  {a.triggered ? "🔔" : "🔕"} {a.crop} — {a.type === "above" ? "↑" : "↓"} ₹{a.threshold.toLocaleString()}
                </span>
                <button onClick={() => removeAlert(a.id)} className="text-muted-foreground hover:text-destructive">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlertManager;
