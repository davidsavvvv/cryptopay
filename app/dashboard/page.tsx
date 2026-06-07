"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MerchantSettings {
  username: string;
  wallet_address: string;
  business_name: string;
}

interface Transaction {
  id: string;
  date: string;
  amount_eur: number;
  amount_usdt: number;
  fee_usdt: number;
  status: "completed" | "pending" | "failed";
  tx_hash: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2026-06-07 14:32", amount_eur: 120, amount_usdt: 118.8, fee_usdt: 1.2, status: "completed", tx_hash: "0xabc...123" },
  { id: "2", date: "2026-06-07 11:05", amount_eur: 350, amount_usdt: 346.5, fee_usdt: 3.5, status: "completed", tx_hash: "0xdef...456" },
  { id: "3", date: "2026-06-06 18:47", amount_eur: 75, amount_usdt: 74.25, fee_usdt: 0.75, status: "pending", tx_hash: "0xghi...789" },
  { id: "4", date: "2026-06-06 09:12", amount_eur: 200, amount_usdt: 198, fee_usdt: 2, status: "completed", tx_hash: "0xjkl...012" },
];

const STATUS_STYLES: Record<Transaction["status"], { bg: string; color: string; label: string }> = {
  completed: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", label: "Confirmé" },
  pending:   { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "En attente" },
  failed:    { bg: "rgba(239,68,68,0.1)",  color: "#ef4444", label: "Échoué" },
};

export default function DashboardPage() {
  const [settings, setSettings] = useState<MerchantSettings>({
    username: "",
    wallet_address: "",
    business_name: "",
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cryptopay_settings");
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const paymentLink = settings.username
    ? `http://localhost:3000/${settings.username}`
    : null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("cryptopay_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCopy() {
    if (!paymentLink) return;
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const totalReceived = MOCK_TRANSACTIONS
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + t.amount_usdt, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--card-border)", background: "var(--card)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--accent)" }}>
            CP
          </div>
          <span className="font-semibold">CryptoPay</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-sm" style={{ color: "var(--muted)" }}>Polygon Mainnet</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total reçu", value: `${totalReceived.toFixed(2)} USDT`, sub: "transactions complétées" },
            { label: "Transactions", value: MOCK_TRANSACTIONS.length.toString(), sub: "ce mois-ci" },
            { label: "Frais reversés", value: `${(totalReceived * 0.01).toFixed(2)} USDT`, sub: "1% partenaire" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings form */}
          <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h2 className="font-semibold text-lg mb-5">Paramètres du compte</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  placeholder="ex: Boutique Luxe Paris"
                  value={settings.business_name}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--card-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>
                  Nom d&apos;utilisateur (URL publique)
                </label>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--card-border)", background: "var(--background)" }}>
                  <span className="px-3 py-2.5 text-sm select-none" style={{ color: "var(--muted)", borderRight: "1px solid var(--card-border)" }}>
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
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>
                  Adresse Wallet Polygon (USDT)
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={settings.wallet_address}
                  onChange={(e) => setSettings({ ...settings, wallet_address: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--card-border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all"
                style={{ background: saved ? "#22c55e" : "var(--accent)" }}
              >
                {saved ? "✓ Sauvegardé !" : "Enregistrer les paramètres"}
              </button>
            </form>
          </div>

          {/* Payment link */}
          <div className="space-y-4">
            <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h2 className="font-semibold text-lg mb-2">Mon lien de paiement</h2>
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                Partagez ce lien à vos clients pour recevoir des paiements.
              </p>
              {paymentLink ? (
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-2 px-3 py-3 rounded-lg"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
                  >
                    <span className="flex-1 text-sm font-mono truncate" style={{ color: "var(--accent)" }}>
                      {paymentLink}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: copied ? "rgba(34,197,94,0.1)" : "var(--background)",
                        border: "1px solid var(--card-border)",
                        color: copied ? "#22c55e" : "var(--foreground)",
                      }}
                    >
                      {copied ? "✓ Copié !" : "Copier le lien"}
                    </button>
                    <Link
                      href={`/${settings.username}`}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center transition-all"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--card-border)",
                        color: "var(--foreground)",
                      }}
                    >
                      Aperçu →
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8 rounded-lg text-sm text-center"
                  style={{ background: "var(--background)", border: "1px dashed var(--card-border)", color: "var(--muted)" }}
                >
                  <span className="text-2xl mb-2">🔗</span>
                  Configurez un username pour générer votre lien
                </div>
              )}
            </div>

            {/* QR placeholder */}
            <div
              className="rounded-xl p-6 flex items-center gap-4"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
              >
                📱
              </div>
              <div>
                <p className="font-medium text-sm mb-0.5">QR Code</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Générez un QR code pour vos points de vente physiques. Bientôt disponible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
            <h2 className="font-semibold">Transactions récentes</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--background)", color: "var(--muted)" }}>
              Données de démonstration
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Date", "Montant EUR", "Reçu USDT", "Frais", "Statut", "Tx Hash"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium" style={{ color: "var(--muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((tx, i) => {
                  const s = STATUS_STYLES[tx.status];
                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: i < MOCK_TRANSACTIONS.length - 1 ? "1px solid var(--card-border)" : "none",
                      }}
                    >
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--muted)" }}>{tx.date}</td>
                      <td className="px-6 py-4 font-semibold">€ {tx.amount_eur.toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold" style={{ color: "var(--success)" }}>
                        {tx.amount_usdt.toFixed(2)} USDT
                      </td>
                      <td className="px-6 py-4 text-xs" style={{ color: "var(--muted)" }}>{tx.fee_usdt.toFixed(2)} USDT</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--muted)" }}>{tx.tx_hash}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
