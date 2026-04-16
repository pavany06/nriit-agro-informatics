import { Camera, ArrowLeft, ImageIcon } from "lucide-react";
import SpeakButton from "./SpeakButton";
import PermissionPrompt from "./PermissionPrompt";
import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPABASE_URL } from "@/lib/supabaseUrl";
import { useNativeCamera } from "@/hooks/useNativeCamera";

interface DiseaseScannerProps {
  onBack: () => void;
}

const DiseaseScanner = ({ onBack }: DiseaseScannerProps) => {
  const { lang } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [showPermission, setShowPermission] = useState(false);
  const [pendingSource, setPendingSource] = useState<"camera" | "gallery" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isNative, openCamera, openGallery } = useNativeCamera();

  const t = (te: string, en: string) => lang === "te" ? te : en;

  const scanImage = async (base64: string) => {
    setImage(base64);
    setResult(null);
    setError("");
    setScanning(true);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/crop-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!resp.ok) throw new Error("Scan failed");
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      setError(t("పరీక్ష విఫలమైంది. మళ్ళీ ప్రయత్నించండి.", "Scan failed. Please try again."));
    } finally {
      setScanning(false);
    }
  };

  const handleNativeCapture = async (source: "camera" | "gallery") => {
    const fn = source === "camera" ? openCamera : openGallery;
    const base64 = await fn();
    if (base64) scanImage(base64);
  };

  const handleCaptureClick = (source: "camera" | "gallery") => {
    if (isNative) {
      setPendingSource(source);
      setShowPermission(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handlePermissionAllow = () => {
    setShowPermission(false);
    if (pendingSource) handleNativeCapture(pendingSource);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      scanImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="px-4 py-6">
      {showPermission && (
        <PermissionPrompt type="camera" onAllow={handlePermissionAllow} onCancel={() => setShowPermission(false)} />
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-primary mb-4 font-telugu text-lg active:scale-95 transition-transform min-h-[48px]">
        <ArrowLeft size={24} /> {t("వెనుకకు", "Back")}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🌱</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">{t("పంట రోగ నిర్ధారణ", "Crop Disease Scanner")}</h2>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />

      {!image ? (
        <div className="space-y-3">
          <button
            onClick={() => handleCaptureClick("camera")}
            className="w-full flex items-center justify-center gap-4 bg-primary text-primary-foreground rounded-2xl p-5 active:scale-95 transition-transform min-h-[64px]"
          >
            <Camera size={32} />
            <span className="text-xl font-bold font-telugu">📷 {t("ఫోటో తీయండి", "Take Photo")}</span>
          </button>

          <button
            onClick={() => handleCaptureClick("gallery")}
            className="w-full flex items-center justify-center gap-4 bg-card border-2 border-border rounded-2xl p-5 active:scale-95 transition-transform min-h-[64px]"
          >
            <ImageIcon size={32} className="text-primary" />
            <span className="text-xl font-bold font-telugu text-foreground">🖼 {t("గ్యాలరీ నుండి ఎంచుకోండి", "Choose from Gallery")}</span>
          </button>

          <p className="text-center text-muted-foreground font-telugu text-sm">{t("పంట ఆకు ఫోటో తీసి పరీక్షించండి", "Take a photo of the crop leaf to scan")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-border">
            <img src={image} alt="Crop" className="w-full max-h-64 object-cover" />
            {scanning && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <div className="bg-card rounded-xl p-6 text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-telugu text-lg">{t("AI పరీక్షిస్తున్నాం...", "AI is scanning...")}</p>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-destructive font-telugu text-center">{error}</p>}

          {result && (
            <div className="bg-card rounded-2xl p-6 border-2 border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-telugu text-foreground">📋 {t("ఫలితం", "Result")}</h3>
                <SpeakButton
                  text={`${result.disease_te || result.disease_en}. ${result.treatment_te || result.treatment_en}`}
                  lang={lang === "te" ? "te-IN" : "en-US"}
                  size="md"
                />
              </div>
              {result.healthy ? (
                <p className="text-success font-telugu text-lg">✅ {t("పంట ఆరోగ్యంగా ఉంది!", "Crop is healthy!")}</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-telugu"><span className="font-bold text-destructive">🔴 {t("రోగం", "Disease")}:</span> {lang === "te" ? result.disease_te : result.disease_en}</p>
                  <p className="font-telugu"><span className="font-bold text-warning">⚠️ {t("తీవ్రత", "Severity")}:</span> {lang === "te" ? result.severity_te : result.severity_en}</p>
                  <p className="font-telugu"><span className="font-bold text-success">💊 {t("చికిత్స", "Treatment")}:</span> {lang === "te" ? result.treatment_te : result.treatment_en}</p>
                </div>
              )}
            </div>
          )}

          <button onClick={() => { setImage(null); setResult(null); setError(""); }} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-telugu text-lg font-bold active:scale-95 transition-transform min-h-[48px]">
            🔄 {t("మరొక ఫోటో తీయండి", "Take Another Photo")}
          </button>
        </div>
      )}
    </section>
  );
};

export default DiseaseScanner;
