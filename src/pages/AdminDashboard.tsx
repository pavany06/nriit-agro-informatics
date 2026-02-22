import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AdminContentManager from "@/components/admin/AdminContentManager";
import { LogOut } from "lucide-react";

const tabs = [
  { id: "news", label: "📢 News", table: "news" },
  { id: "schemes", label: "🏛 Schemes", table: "schemes" },
  { id: "alerts", label: "⚠️ Alerts", table: "alerts" },
  { id: "methods", label: "🌍 Methods", table: "farming_methods" },
  { id: "videos", label: "🎥 Videos", table: "videos" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/admin/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-lg">NRIIT Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-80">{user?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 active:scale-95 transition-transform">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Manager */}
        {tabs.map((tab) => (
          activeTab === tab.id && <AdminContentManager key={tab.id} tableName={tab.table} tabId={tab.id} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
