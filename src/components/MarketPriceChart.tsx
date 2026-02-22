import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface MarketPriceChartProps {
  records: MarketRecord[];
  selectedCrop: string;
}

const MarketPriceChart = ({ records, selectedCrop }: MarketPriceChartProps) => {
  const { lang } = useLanguage();

  // Group by market and show modal prices
  const chartData = records
    .filter((r) => r.commodity.toLowerCase() === selectedCrop.toLowerCase())
    .slice(0, 10)
    .map((r) => ({
      market: r.market.length > 12 ? r.market.slice(0, 12) + "…" : r.market,
      min: r.min_price,
      max: r.max_price,
      modal: r.modal_price,
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-4">
      <h3 className="text-lg font-bold font-telugu mb-3">
        📊 {lang === "te" ? `${selectedCrop} - మార్కెట్ ధరల చార్ట్` : `${selectedCrop} - Market Price Chart`}
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="market" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => `📍 ${label}`}
            />
            <Bar dataKey="min" fill="hsl(var(--destructive))" name={lang === "te" ? "కనిష్ట" : "Min"} radius={[2, 2, 0, 0]} />
            <Bar dataKey="modal" fill="hsl(var(--primary))" name={lang === "te" ? "సాధారణ" : "Modal"} radius={[2, 2, 0, 0]} />
            <Bar dataKey="max" fill="hsl(var(--success, 142 76% 36%))" name={lang === "te" ? "గరిష్ట" : "Max"} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketPriceChart;
