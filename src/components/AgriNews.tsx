import { ArrowLeft } from "lucide-react";
import SpeakButton from "./SpeakButton";

interface AgriNewsProps {
  onBack: () => void;
}

const newsItems = [
  {
    headline: "ఖరీఫ్ 2026 కోసం విత్తన పంపిణీ ప్రారంభం",
    summary: "రాష్ట్ర ప్రభుత్వం రైతులకు సబ్సిడీ విత్తనాలు అందించడం ప్రారంభించింది.",
    date: "2026-02-20",
  },
  {
    headline: "మిరప ధరలు గుంటూరు మార్కెట్‌లో పెరిగాయి",
    summary: "ఈ వారం మిరప ధరలు 15% పెరిగాయి. రైతులకు మంచి ఆదాయం.",
    date: "2026-02-19",
  },
  {
    headline: "డ్రోన్ ద్వారా పురుగుల మందు చల్లడం విజయవంతం",
    summary: "తెలంగాణలో డ్రోన్ ద్వారా పంటలకు మందు చల్లడం ప్రయోగం విజయవంతమైంది.",
    date: "2026-02-18",
  },
  {
    headline: "వర్షాభావ ప్రాంతాలకు ప్రత్యేక నిధులు",
    summary: "కేంద్ర ప్రభుత్వం వర్షాభావ ప్రాంతాల రైతులకు ₹500 కోట్ల ప్రత్యేక నిధులు విడుదల.",
    date: "2026-02-17",
  },
];

const AgriNews = ({ onBack }: AgriNewsProps) => {
  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">📢</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">వ్యవసాయ వార్తలు</h2>
      </div>

      <div className="space-y-4">
        {newsItems.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border card-hover">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">📅 {item.date}</p>
                <h3 className="text-lg font-bold font-telugu text-foreground mb-1">{item.headline}</h3>
                <p className="text-sm text-muted-foreground font-telugu">{item.summary}</p>
              </div>
              <SpeakButton text={`${item.headline}. ${item.summary}`} size="sm" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6 font-telugu">
        📡 డెమో వార్తలు — అసలు వార్తల కోసం API అనుసంధానం అవసరం
      </p>
    </section>
  );
};

export default AgriNews;
