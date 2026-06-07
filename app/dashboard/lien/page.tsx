"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, type MerchantSettings } from "@/lib/supabase";

interface PaymentLink {
  id: string;
  label: string;
  slug: string;
  amount?: number;
  type: "libre" | "fixe";
}

function LinkForm({
  initial,
  merchantUsername,
  onSave,
  onCancel,
}: {
  initial?: PaymentLink;
  merchantUsername: string;
  onSave: (link: PaymentLink) => void;
  onCancel: () => void;
}) {
  const [label, setLabel]   = useState(initial?.label ?? "");
  const [type, setType]     = useState<"libre" | "fixe">(initial?.type ?? "libre");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = initial?.slug ?? `${merchantUsername}-${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
    onSave({
      id:     initial?.id ?? Date.now().toString(),
      label,
      slug,
      type,
      amount: type === "fixe" ? parseFloat(amount) : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
          Nom du lien
        </label>
        <input
          type="text"
          placeholder="ex: Consultation, Abonnement Premium…"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
          Type de paiement
        </label>
        <div className="flex gap-3">
          {[
            { value: "libre", label: "Montant libre",  desc: "Le client choisit le montant" },
            { value: "fixe",  label: "Montant fixe",   desc: "Vous définissez le montant" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value as "libre" | "fixe")}
              className="flex-1 px-4 py-3 rounded-lg text-left transition-all"
              style={{
                background: type === opt.value ? "rgba(108,99,255,0.15)" : "var(--background)",
                border: `1px solid ${type === opt.value ? "var(--accent)" : "var(--card-border)"}`,
              }}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {type === "fixe" && (
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
            Montant (€)
          </label>
          <input
            type="number"
            placeholder="ex: 19.90"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
          />
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          {initial ? "Enregistrer les modifications" : "Créer le lien"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium"
          style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default function LienPage() {
  const [merchant, setMerchant]     = useState<MerchantSettings | null>(null);
  const [links, setLinks]           = useState<PaymentLink[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [copiedId, setCopiedId]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const username = localStorage.getItem("cryptopay_username");
      if (!username) return;
      const { data } = await supabase
        .from("merchants")
        .select("*")
        .eq("username", username)
        .single();
      if (data) {
        setMerchant(data);
        const stored = localStorage.getItem(`cryptopay_links_${username}`);
        if (stored) {
          setLinks(JSON.parse(stored));
        } else {
          const defaultLink: PaymentLink = { id: "1", label: "Lien principal", slug: username, type: "libre" };
          setLinks([defaultLink]);
          localStorage.setItem(`cryptopay_links_${username}`, JSON.stringify([defaultLink]));
        }
      }
    }
    load();
  }, []);

  function saveLinks(updated: PaymentLink[]) {
    setLinks(updated);
    const username = localStorage.getItem("cryptopay_username");
    if (username) localStorage.setItem(`cryptopay_links_${username}`, JSON.stringify(updated));
  }

  function handleCreate(link: PaymentLink) {
    saveLinks([...links, link]);
    setShowCreate(false);
  }

  function handleEdit(link: PaymentLink) {
    saveLinks(links.map((l) => (l.id === link.id ? link : l)));
    setEditingId(null);
  }

  function handleDelete(id: string) {
    saveLinks(links.filter((l) => l.id !== id));
  }

  function handleCopy(slug: string, id: string) {
    navigator.clipboard.writeText(`http://localhost:3000/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Mes liens de paiement</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Créez plusieurs liens pour différents produits ou services.
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "var(--accent)" }}
        >
          <span className="text-lg leading-none">+</span>
          Nouveau lien
        </button>
      </div>

      {/* Formulaire création */}
      {showCreate && merchant && (
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h3 className="font-semibold mb-4">Créer un nouveau lien</h3>
          <LinkForm
            merchantUsername={merchant.username}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {/* Liste des liens */}
      {links.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-xl text-center"
          style={{ background: "var(--card)", border: "1px dashed var(--card-border)", color: "var(--muted)" }}
        >
          <span className="text-4xl mb-3">🔗</span>
          <p className="text-sm font-medium">Aucun lien créé.</p>
          <p className="text-xs mt-1">Cliquez sur &quot;+ Nouveau lien&quot; pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              {/* Card header */}
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
                  >
                    🔗
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{link.label}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: link.type === "fixe" ? "rgba(108,99,255,0.15)" : "rgba(34,197,94,0.1)",
                        color: link.type === "fixe" ? "var(--accent)" : "#22c55e",
                      }}
                    >
                      {link.type === "fixe" ? `€ ${link.amount?.toFixed(2)} fixe` : "Montant libre"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingId(editingId === link.id ? null : link.id); setShowCreate(false); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Formulaire édition inline */}
              {editingId === link.id && merchant && (
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--card-border)", background: "var(--background)" }}>
                  <LinkForm
                    initial={link}
                    merchantUsername={merchant.username}
                    onSave={handleEdit}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              )}

              {/* Card body */}
              <div className="px-5 py-4 space-y-3">
                <div
                  className="px-3 py-2.5 rounded-lg font-mono text-xs break-all"
                  style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--accent)" }}
                >
                  http://localhost:3000/{link.slug}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(link.slug, link.id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: copiedId === link.id ? "rgba(34,197,94,0.1)" : "var(--background)",
                      border: "1px solid var(--card-border)",
                      color: copiedId === link.id ? "#22c55e" : "var(--foreground)",
                    }}
                  >
                    {copiedId === link.id ? "✓ Copié !" : "📋 Copier"}
                  </button>
                  <Link
                    href={`/${link.slug}`}
                    target="_blank"
                    className="flex-1 py-2 rounded-lg text-xs font-medium text-center transition-all"
                    style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                  >
                    Aperçu →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
