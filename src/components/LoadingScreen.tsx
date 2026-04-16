const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4">
    <span className="text-6xl">🌾</span>
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="font-telugu text-lg text-muted-foreground">NRIIT Agro Informatics</p>
  </div>
);

export default LoadingScreen;
