"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowser();

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid var(--card-border)",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "14px",
    outline: "none",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      router.push("/dashboard");
      router.refresh();
    } else {
      // Vérifier que le username est dispo
      const { data: existing } = await supabase
        .from("merchants")
        .select("id")
        .eq("username", username)
        .single();
      if (existing) { setError("Ce nom d'utilisateur est déjà pris."); setLoading(false); return; }

      const { data: authData, error: signUpErr } = await supabase.auth.signUp({ email, password });
      if (signUpErr || !authData.user) { setError(signUpErr?.message ?? "Erreur inscription"); setLoading(false); return; }

      const { error: merchantErr } = await supabase.from("merchants").insert({
        user_id: authData.user.id,
        username: username.toLowerCase().replace(/\s+/g, "-"),
        business_name: businessName,
        wallet_address: walletAddress,
      });
      if (merchantErr) { setError(merchantErr.message); setLoading(false); return; }

      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--accent)" }}>
            CP
          </div>
          <span className="font-bold text-lg">CryptoPay</span>
        </div>

        <div className="rounded-2xl p-7" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h1 className="text-xl font-bold mb-1">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {mode === "login"
              ? "Accédez à votre dashboard marchand."
              : "Commencez à recevoir des paiements."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Nom de l&apos;entreprise</label>
                  <input
                    required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ex : Boutique Luxe" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                    Nom d&apos;utilisateur <span style={{ color: "var(--muted)", fontWeight: 400 }}>(URL publique)</span>
                  </label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid var(--card-border)" }}>
                    <span className="px-3 py-2.5 text-sm flex-shrink-0" style={{ color: "var(--muted)", borderRight: "1px solid var(--card-border)", background: "var(--background)" }}>
                      cryptopay.app/
                    </span>
                    <input
                      required value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="mon-username"
                      style={{ ...inputStyle, borderRadius: 0, border: "none", flex: 1 }}
                      onFocus={(e) => (e.currentTarget.parentElement!.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.currentTarget.parentElement!.style.borderColor = "var(--card-border)")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Wallet Polygon (USDT)</label>
                  <input
                    required value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..." style={{ ...inputStyle, fontFamily: "monospace" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com" style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Mot de passe</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle} minLength={6}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Chargement…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>
            {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
            {" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
              className="font-semibold"
              style={{ color: "var(--accent)" }}
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
