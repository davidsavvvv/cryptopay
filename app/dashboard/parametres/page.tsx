"use client";

import { useState, useEffect } from "react";
import { supabase, type MerchantSettings } from "@/lib/supabase";

export default function ParametresPage() {
  const [settings, setSettings] = useState<MerchantSettings>({
    username: "",
    wallet_address: "",
    business_name: "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const username = localStorage.getItem("cryptopay_username");
      if (!username) return;
      const { data } = await supabase
        .from("merchants")
        .select("*")
        .eq("username", username)
        .single();
      if (data) setSettings(data);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: existing } = await supabase
      .from("merchants")
      .select("id")
      .eq("username", settings.username)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from("merchants")
        .update({
          wallet_address: settings.wallet_address,
          business_name: settings.business_name,
        })
        .eq("username", settings.username);
    } else {
      result = await supabase
        .from("merchants")
        .insert({
          username: settings.username,
          wallet_address: settings.wallet_address,
          business_name: settings.business_name,
        });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      localStorage.setItem("cryptopay_username", settings.username);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="font-semibold text-lg mb-1">Paramètres du compte</h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Ces informations seront affichées sur votre page de paiement.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
              Nom de l&apos;entreprise
            </label>
            <input
              type="text"
              placeholder="ex: Boutique Luxe Paris"
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
              Nom d&apos;utilisateur (URL publique)
            </label>
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--card-border)", background: "var(--background)" }}>
              <span className="px-3 py-2.5 text-sm select-none flex-shrink-0" style={{ color: "var(--muted)", borderRight: "1px solid var(--card-border)" }}>
                localhost:3000/
              </span>
              <input
                type="text"
                placeholder="mon-username"
                value={settings.username}
                onChange={(e) =>
                  setSettings({ ...settings, username: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                }
                className="flex-1 px-3 py-2.5 text-sm outline-none"
                style={{ background: "transparent", color: "var(--foreground)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
              Adresse Wallet Polygon (USDT)
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={settings.wallet_address}
              onChange={(e) => setSettings({ ...settings, wallet_address: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none"
              style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            />
            <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              Les fonds seront envoyés sur cette adresse après chaque paiement.
            </p>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-60"
            style={{ background: saved ? "#22c55e" : "var(--accent)" }}
          >
            {saving ? "Sauvegarde…" : saved ? "✓ Sauvegardé !" : "Enregistrer les paramètres"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid rgba(239,68,68,0.3)" }}>
        <h2 className="font-semibold mb-1" style={{ color: "#ef4444" }}>Zone de danger</h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Ces actions sont irréversibles.
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
          onClick={() => {
            localStorage.removeItem("cryptopay_username");
            window.location.href = "/dashboard";
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
