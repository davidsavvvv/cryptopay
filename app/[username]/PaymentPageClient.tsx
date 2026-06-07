"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface MerchantSettings {
  username: string;
  wallet_address: string;
  business_name: string;
}

function PaymentModal({
  amount,
  merchantName,
  walletAddress,
  onClose,
}: {
  amount: number;
  merchantName: string;
  walletAddress: string;
  onClose: () => void;
}) {
  const fee = amount * 0.01;
  const netUsdt = amount - fee;
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const truncatedWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "0x0000...0000";

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 3000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: "var(--accent)" }}>
              CP
            </div>
            <span className="font-semibold text-sm">CryptoPay Checkout</span>
          </div>
          <button onClick={onClose} className="text-lg leading-none" style={{ color: "var(--muted)" }}>✕</button>
        </div>

        {/* Order summary */}
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--card-border)", background: "var(--background)" }}>
          <div className="flex items-center justify-between">
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
          <div className="mt-3 pt-3 border-t flex justify-between text-xs" style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}>
            <span>Frais de service (1%)</span>
            <span>{fee.toFixed(2)} USDT</span>
          </div>
        </div>

        <div className="px-6 py-6">
          {step === "form" && (
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                  Numéro de carte
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                    setCardNumber(v);
                  }}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none"
                  style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                    }}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
                style={{ background: "var(--accent)" }}
              >
                Payer € {amount.toFixed(2)} par Carte
              </button>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-xs" style={{ color: "var(--muted)" }}>Sécurisé par</span>
                {["VISA", "MC", "3DS"].map((b) => (
                  <span key={b} className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: "var(--background)", color: "var(--muted)", border: "1px solid var(--card-border)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </form>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div
                className="w-14 h-14 rounded-full border-4 animate-spin"
                style={{ borderColor: "var(--card-border)", borderTopColor: "var(--accent)" }}
              />
              <p className="font-semibold">Traitement du paiement...</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Conversion en USDT et envoi vers le wallet marchand
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "rgba(34,197,94,0.15)", border: "2px solid #22c55e" }}
              >
                ✓
              </div>
              <div>
                <p className="font-bold text-lg">Paiement confirmé !</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  {netUsdt.toFixed(2)} USDT envoyés vers {truncatedWallet}
                </p>
              </div>
              <div
                className="w-full p-3 rounded-lg text-xs font-mono text-left"
                style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
              >
                <p>Réseau: Polygon (MATIC)</p>
                <p>Token: USDT (ERC-20)</p>
                <p>Tx: 0x{Math.random().toString(16).slice(2, 18)}...</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PaymentLink {
  id: string;
  label: string;
  slug: string;
  amount?: number;
  type: "libre" | "fixe";
}

export default function PaymentPageClient({ username }: { username: string }) {
  const [merchant, setMerchant] = useState<MerchantSettings | null>(null);
  const [amount, setAmount] = useState("");
  const [fixedAmount, setFixedAmount] = useState<number | null>(null);
  const [linkLabel, setLinkLabel] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Chercher le marchand dont le username principal correspond
    // OU dont un lien a ce slug
    async function load() {
      // 1. Chercher dans tous les marchands leurs liens stockés
      // On cherche d'abord si c'est le username direct
      const { data: merchantDirect } = await supabase
        .from("merchants")
        .select("*")
        .eq("username", username)
        .single();

      if (merchantDirect) {
        setMerchant(merchantDirect);
        return;
      }

      // 2. Sinon c'est un slug de lien — chercher dans localStorage
      // Le slug est de la forme "username-nom-id"
      // On extrait le username (première partie avant le premier tiret suivi d'un mot)
      const allKeys = Object.keys(localStorage).filter((k) => k.startsWith("cryptopay_links_"));
      for (const key of allKeys) {
        const links: PaymentLink[] = JSON.parse(localStorage.getItem(key) || "[]");
        const found = links.find((l) => l.slug === username);
        if (found) {
          const merchantUsername = key.replace("cryptopay_links_", "");
          const { data: m } = await supabase
            .from("merchants")
            .select("*")
            .eq("username", merchantUsername)
            .single();
          if (m) {
            setMerchant(m);
            if (found.type === "fixe" && found.amount) {
              setFixedAmount(found.amount);
              setAmount(found.amount.toString());
            }
            setLinkLabel(found.label);
          }
          return;
        }
      }
    }
    load();
  }, [username]);

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * 0.01;
  const netUsdt = numAmount - fee;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: "var(--card-border)", background: "var(--card)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: "var(--accent)" }}>
            CP
          </div>
          <span className="text-sm font-semibold">CryptoPay</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs" style={{ color: "var(--muted)" }}>Polygon · USDT</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          {/* Merchant card */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
            >
              🏪
            </div>
            <h1 className="font-bold text-xl mb-1">
              {merchant?.business_name || username}
            </h1>
            <p className="text-sm mb-0.5" style={{ color: "var(--muted)" }}>@{username}</p>
            {merchant?.wallet_address && (
              <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                {merchant.wallet_address.slice(0, 8)}...{merchant.wallet_address.slice(-6)}
              </p>
            )}
          </div>

          {/* Amount form */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            {linkLabel && (
              <p className="text-xs font-medium mb-3 px-2 py-1 rounded-full inline-block" style={{ background: "rgba(108,99,255,0.15)", color: "var(--accent)" }}>
                {linkLabel}
              </p>
            )}

            <label className="block text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>
              Montant à payer
            </label>

            {/* Montant fixe — non modifiable */}
            {fixedAmount ? (
              <div
                className="flex items-center gap-2 px-4 py-4 rounded-xl mb-4"
                style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
              >
                <span className="text-xl font-bold" style={{ color: "var(--muted)" }}>€</span>
                <span className="flex-1 text-3xl font-bold">{fixedAmount.toFixed(2)}</span>
                <span className="text-sm font-medium px-2 py-1 rounded-lg" style={{ background: "var(--card)", color: "var(--muted)" }}>
                  EUR
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
                style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
              >
                <span className="text-xl font-bold" style={{ color: "var(--muted)" }}>€</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 text-2xl font-bold outline-none"
                  style={{ background: "transparent", color: "var(--foreground)" }}
                />
                <span className="text-sm font-medium px-2 py-1 rounded-lg" style={{ background: "var(--card)", color: "var(--muted)" }}>
                  EUR
                </span>
              </div>
            )}

            {numAmount > 0 && (
              <div className="space-y-1.5 mb-5 text-sm" style={{ color: "var(--muted)" }}>
                <div className="flex justify-between">
                  <span>Montant</span>
                  <span className="font-medium" style={{ color: "var(--foreground)" }}>€ {numAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais (1%)</span>
                  <span>{fee.toFixed(2)} USDT</span>
                </div>
              </div>
            )}

            {/* Presets — uniquement si montant libre */}
            {!fixedAmount && (
              <div className="flex gap-2 mb-4">
                {[20, 50, 100, 200].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: numAmount === preset ? "var(--accent)" : "var(--background)",
                      border: "1px solid var(--card-border)",
                      color: numAmount === preset ? "white" : "var(--muted)",
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
              style={{ background: "var(--accent)" }}
            >
              Payer par Carte Bancaire
            </button>

            <p className="text-center text-xs mt-3" style={{ color: "var(--muted)" }}>
              🔒 Paiement sécurisé · Fonds convertis en USDT
            </p>
          </div>
        </div>
      </main>

      {showModal && numAmount > 0 && merchant && (
        <PaymentModal
          amount={numAmount}
          merchantName={merchant.business_name}
          walletAddress={merchant.wallet_address}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
