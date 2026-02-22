import { Camera, ArrowLeft, Upload } from "lucide-react";
import SpeakButton from "./SpeakButton";
import { useState, useRef } from "react";

interface DiseaseScannerProps {
  onBack: () => void;
}

const DiseaseScanner = ({ onBack }: DiseaseScannerProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ disease: string; severity: string; treatment: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
      // Simulate scan (Gemini Vision needed for real)
      setScanning(true);
      setTimeout(() => {
        setResult({
          disease: "ఆకు మచ్చ రోగం (Leaf Spot)",
          severity: "మధ్యస్థం",
          treatment: "మాంకోజెబ్ 2.5 గ్రాముల పొడిని 1 లీటర్ నీటిలో కలిపి పిచికారీ చేయండి. వారానికి ఒకసారి 2-3 సార్లు చేయండి.",
        });
        setScanning(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform">
        <ArrowLeft size={24} /> వెనుకకు
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🌱</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">పంట రోగ నిర్ధారణ</h2>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {!image ? (
        <button
          onClick={handleCapture}
          className="w-full flex flex-col items-center justify-center gap-4 bg-card border-4 border-dashed border-primary/30 rounded-2xl p-12 card-hover active:scale-95 transition-transform"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera size={48} className="text-primary" />
          </div>
          <p className="text-xl font-bold font-telugu text-foreground">📷 ఫోటో తీయండి</p>
          <p className="text-muted-foreground font-telugu">పంట ఆకు ఫోటో తీసి పరీక్షించండి</p>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-border">
            <img src={image} alt="పంట ఫోటో" className="w-full max-h-64 object-cover" />
            {scanning && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <div className="bg-card rounded-xl p-6 text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-telugu text-lg">పరీక్షిస్తున్నాం...</p>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="bg-card rounded-2xl p-6 border-2 border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-telugu text-foreground">📋 ఫలితం</h3>
                <SpeakButton
                  text={`రోగం: ${result.disease}. తీవ్రత: ${result.severity}. చికిత్స: ${result.treatment}`}
                  size="md"
                />
              </div>
              <div className="space-y-2">
                <p className="font-telugu"><span className="font-bold text-destructive">🔴 రోగం:</span> {result.disease}</p>
                <p className="font-telugu"><span className="font-bold text-warning">⚠️ తీవ్రత:</span> {result.severity}</p>
                <p className="font-telugu"><span className="font-bold text-success">💊 చికిత్స:</span> {result.treatment}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => { setImage(null); setResult(null); }}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-telugu text-lg font-bold active:scale-95 transition-transform"
          >
            🔄 మరొక ఫోటో తీయండి
          </button>
        </div>
      )}
    </section>
  );
};

export default DiseaseScanner;
