"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { supabase } from "@/lib/supabase";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── Types ─────────────────────────────────────────────────────────────────────

interface MerchantSettings {
  username: string;
  wallet_address: string;
  business_name: string;
}

interface PreviewConfig {
  bg: string;
  cardBg: string;
  accent: string;
  textColor: string;
  borderRadius: string;
  businessName: string;
  tagline: string;
  amount: string;
  font: "inter" | "serif";
  logoUrl: string | null;
  bgImageUrl: string | null;
  buttonLabel: string;
  showBadge: boolean;
  style: "flat" | "glass" | "gradient";
}

const DEFAULT_CONFIG: PreviewConfig = {
  bg: "#09090b",
  cardBg: "#111113",
  accent: "#6c63ff",
  textColor: "#fafafa",
  borderRadius: "16",
  businessName: "",
  tagline: "Paiement sécurisé",
  amount: "",
  font: "inter",
  logoUrl: null,
  bgImageUrl: null,
  buttonLabel: "Payer par Carte Bancaire",
  showBadge: true,
  style: "flat",
};

// ── Formulaire Stripe (à l'intérieur du provider Elements) ───────────────────

function StripeCheckoutForm({
  amount,
  merchantName,
  walletAddress,
  accent,
  onSuccess,
}: {
  amount: number;
  merchantName: string;
  walletAddress: string;
  accent: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fee = amount * 0.01;
  const netUsdt = (amount - fee);
  const truncatedWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x0000...0000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) { setError(submitError.message ?? "Erreur"); setLoading(false); return; }

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const { clientSecret, error: apiError } = await res.json();
    if (apiError) { setError(apiError); setLoading(false); return; }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Paiement refusé");
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>Paiement à</p>
          <p className="font-semibold">{merchantName || "Marchand"}</p>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--muted)" }}>{truncatedWallet}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">€ {amount.toFixed(2)}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>≈ {netUsdt.toFixed(2)} USDT</p>
        </div>
      </div>
      <div className="pt-3 border-t flex justify-between text-xs mb-4" style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}>
        <span>Frais de service (1%)</span>
        <span>{fee.toFixed(2)} USDT</span>
      </div>

      <PaymentElement options={{ layout: "tabs" }} />

      {error && (
        <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity disabled:opacity-50"
        style={{ background: accent }}
      >
        {loading ? "Traitement..." : `Payer € ${amount.toFixed(2)}`}
      </button>

      <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
        🔒 Sécurisé par Stripe · Fonds convertis en USDT
      </p>
    </form>
  );
}

// ── Modal paiement ────────────────────────────────────────────────────────────

function PaymentModal({
  amount,
  merchantName,
  walletAddress,
  accent,
  onClose,
}: {
  amount: number;
  merchantName: string;
  walletAddress: string;
  accent: string;
  onClose: () => void;
}) {
  const [success, setSuccess] = useState(false);
  const netUsdt = amount * 0.99;

  const stripeOptions = {
    mode: "payment" as const,
    amount: Math.round(amount * 100),
    currency: "eur",
    appearance: {
      theme: "night" as const,
      variables: { colorPrimary: accent, borderRadius: "10px", fontFamily: "system-ui, sans-serif" },
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)", maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: accent }}>CP</div>
            <span className="font-semibold text-sm">CryptoPay Checkout</span>
          </div>
          <button onClick={onClose} className="text-lg leading-none" style={{ color: "var(--muted)" }}>✕</button>
        </div>

        <div className="px-6 py-6 overflow-y-auto flex-1">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: "rgba(34,197,94,0.15)", border: "2px solid #22c55e" }}>✓</div>
              <div>
                <p className="font-bold text-lg">Paiement confirmé !</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{netUsdt.toFixed(2)} USDT envoyés vers le wallet</p>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-sm" style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}>
                Fermer
              </button>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <StripeCheckoutForm
                amount={amount}
                merchantName={merchantName}
                walletAddress={walletAddress}
                accent={accent}
                onSuccess={() => setSuccess(true)}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function PaymentPageClient({ username }: { username: string }) {
  const [merchant, setMerchant] = useState<MerchantSettings | null>(null);
  const [amount, setAmount] = useState("");
  const [fixedAmount, setFixedAmount] = useState<number | null>(null);
  const [linkLabel, setLinkLabel] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cfg, setCfg] = useState<PreviewConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    async function load() {
      // 1. Username direct ?
      const { data: merchantDirect } = await supabase
        .from("merchants").select("*").eq("username", username).single();

      if (merchantDirect) {
        setMerchant(merchantDirect);
        return;
      }

      // 2. Slug de lien — chercher dans Supabase
      const { data: linkRow } = await supabase
        .from("payment_links").select("*").eq("slug", username).single();

      if (!linkRow) return;

      const { data: m } = await supabase
        .from("merchants").select("*").eq("username", linkRow.merchant_username).single();

      if (!m) return;
      setMerchant(m);
      setLinkLabel(linkRow.label);

      if (linkRow.type === "fixe" && linkRow.amount) {
        setFixedAmount(linkRow.amount);
        setAmount(String(linkRow.amount));
      }

      // 3. Aperçu stocké dans la ligne
      if (linkRow.apercu_config) {
        setCfg(linkRow.apercu_config as unknown as PreviewConfig);
      }
    }
    load();
  }, [username]);

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * 0.01;
  const isLight = cfg.textColor.toLowerCase() === "#09090b" || cfg.textColor.toLowerCase() === "#111111";
  const muted = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.5)";

  const cardBg =
    cfg.style === "glass"
      ? cfg.cardBg
      : cfg.style === "gradient"
      ? `linear-gradient(135deg, ${cfg.cardBg} 0%, ${cfg.accent}22 100%)`
      : cfg.cardBg;

  const displayName = cfg.businessName || merchant?.business_name || username;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          cfg.style === "gradient"
            ? `radial-gradient(ellipse at top, ${cfg.accent}33 0%, ${cfg.bg} 60%)`
            : cfg.bg,
        color: cfg.textColor,
        fontFamily: cfg.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Image de fond */}
      {cfg.bgImageUrl && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 0,
            backgroundImage: `url(${cfg.bgImageUrl})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
      )}

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-3 border-b"
        style={{
          borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)",
          background: isLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: cfg.accent }}>
            CP
          </div>
          <span className="text-sm font-semibold">CryptoPay</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs" style={{ color: muted }}>Polygon · USDT</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          {/* Carte marchand */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: cardBg,
              backdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined,
              WebkitBackdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined,
              border: cfg.style === "glass"
                ? "1px solid rgba(255,255,255,0.15)"
                : `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: `${cfg.borderRadius}px`,
              color: cfg.textColor,
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-3"
              style={{ background: cfg.accent }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-bold text-xl mb-1">{displayName}</h1>
            <p className="text-sm mb-0.5" style={{ color: muted }}>@{username}</p>
            {cfg.showBadge && (
              <span
                className="inline-flex items-center gap-1.5 mt-2 text-xs px-2.5 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                ✓ Paiement sécurisé
              </span>
            )}
          </div>

          {/* Formulaire montant */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: cardBg,
              backdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined,
              WebkitBackdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined,
              border: cfg.style === "glass"
                ? "1px solid rgba(255,255,255,0.15)"
                : `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: `${cfg.borderRadius}px`,
              color: cfg.textColor,
            }}
          >
            {linkLabel && (
              <span
                className="text-xs font-medium mb-3 px-2.5 py-1 rounded-full inline-block"
                style={{ background: `${cfg.accent}22`, color: cfg.accent }}
              >
                {linkLabel}
              </span>
            )}

            <label className="block text-xs font-medium mb-3" style={{ color: muted }}>
              Montant à payer
            </label>

            {fixedAmount ? (
              <div
                className="flex items-center gap-2 px-4 py-4 rounded-xl mb-4"
                style={{
                  background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span className="text-xl font-bold" style={{ color: muted }}>€</span>
                <span className="flex-1 text-3xl font-bold" style={{ color: cfg.textColor }}>{fixedAmount.toFixed(2)}</span>
                <span className="text-sm font-medium px-2 py-1 rounded-lg" style={{ background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)", color: muted }}>EUR</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
                style={{
                  background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span className="text-xl font-bold" style={{ color: muted }}>€</span>
                <input
                  type="number" min="1" step="0.01" placeholder="0.00" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 text-2xl font-bold outline-none"
                  style={{ background: "transparent", color: cfg.textColor }}
                />
                <span className="text-sm font-medium px-2 py-1 rounded-lg" style={{ background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)", color: muted }}>EUR</span>
              </div>
            )}

            {numAmount > 0 && (
              <div className="space-y-1.5 mb-5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: muted }}>Montant</span>
                  <span className="font-medium" style={{ color: cfg.textColor }}>€ {numAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: muted }}>Frais (1%)</span>
                  <span style={{ color: muted }}>{fee.toFixed(2)} USDT</span>
                </div>
              </div>
            )}

            {!fixedAmount && (
              <div className="flex gap-2 mb-4">
                {[20, 50, 100, 200].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: numAmount === preset ? cfg.accent : isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
                      color: numAmount === preset ? "#fff" : muted,
                    }}
                  >
                    €{preset}
                  </button>
                ))}
              </div>
            )}

            <button
              disabled={numAmount < 1}
              onClick={() => setShowModal(true)}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: cfg.accent,
                borderRadius: `${Math.max(8, parseInt(cfg.borderRadius) - 4)}px`,
                boxShadow: `0 4px 20px ${cfg.accent}44`,
              }}
            >
              {cfg.buttonLabel || "Payer par Carte Bancaire"}
            </button>

            <p className="text-center text-xs mt-3" style={{ color: muted }}>
              🔒 Paiement sécurisé · Fonds convertis en USDT
            </p>
          </div>
        </div>
      </main>

      {showModal && numAmount > 0 && merchant && (
        <PaymentModal
          amount={numAmount}
          merchantName={displayName}
          walletAddress={merchant.wallet_address}
          accent={cfg.accent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
