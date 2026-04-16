import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Hide splash screen after app renders
if (Capacitor.isNativePlatform()) {
  SplashScreen.hide({ fadeOutDuration: 300 });
}
