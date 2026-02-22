import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid credentials. Please try again.");
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password) { setError("Enter email and password first"); return; }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setError(authError.message);
    } else {
      setMessage("Account created! Now click Login.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold text-foreground mt-4 font-telugu">Admin Login</h1>
          <p className="text-muted-foreground mt-2">NRIIT Agro Informatics</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
          {error && <p className="text-destructive text-sm text-center bg-destructive/10 rounded-lg p-3">{error}</p>}
          {message && <p className="text-success text-sm text-center bg-success/10 rounded-lg p-3">{message}</p>}

          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-muted text-foreground font-bold active:scale-95 transition-transform disabled:opacity-50 text-sm"
          >
            First time? Create Admin Account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          <a href="/" className="text-primary hover:underline">← Back to Farmer App</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
